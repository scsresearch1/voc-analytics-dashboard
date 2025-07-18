const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { parse } = require('csv-parse/sync');

const app = express();
const PORT = 4000;
const DATA_DIR = path.resolve(__dirname, '../');

app.use(cors());

// In-memory cache for parsed CSV files and summaries
const csvCache = {};
const summaryCache = {};

const NON_SENSOR_COLUMNS = [
  'SNO', 'Timestamp', 'Phase', 'Heater_Profile', 'Heater_Temparature',
  'Alpha_PID', 'Temp', 'Hum', 'ActiveSensorsArray', 'VOC_Activated',
  'Concentration', 'Distance', 'Distance(ft)'
];
function normalize(h) {
  return h && h.replace(/\s+/g, '').toUpperCase();
}
const sensorCache = {};

// List all VoC/configuration CSV files
app.get('/api/files', async (req, res) => {
  try {
    const files = (await fs.readdir(DATA_DIR))
      .filter(f => f.endsWith('.csv'));
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list files', details: err.message });
  }
});

// Serve the contents of a selected CSV file as JSON, with optional columns
app.get('/api/file', async (req, res) => {
  const { name, columns } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing file name' });
  const filePath = path.join(DATA_DIR, name);
  try {
    // Check cache first
    if (!csvCache[name]) {
      if (!(await fs.stat(filePath)).isFile()) return res.status(404).json({ error: 'File not found' });
      const csvString = await fs.readFile(filePath, 'utf8');
      const records = parse(csvString, { skip_empty_lines: true });
      csvCache[name] = records;
    }
    let data = csvCache[name];
    // If columns are specified, filter columns
    if (columns) {
      const colArr = Array.isArray(columns) ? columns : columns.split(',');
      const header = data[0];
      const idxs = header.map((h, i) => colArr.includes(h) ? i : -1).filter(i => i !== -1);
      data = [idxs.map(i => header[i]), ...data.slice(1).map(row => idxs.map(i => row[i]))];
    }
    res.json({ name, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read file', details: err.message });
  }
});

// Serve summary statistics for a file/column
app.get('/api/summary', async (req, res) => {
  const { name, column } = req.query;
  if (!name || !column) return res.status(400).json({ error: 'Missing parameters' });
  const cacheKey = `${name}|${column}`;
  if (summaryCache[cacheKey]) return res.json(summaryCache[cacheKey]);
  try {
    // Use cached file if available
    if (!csvCache[name]) {
      const filePath = path.join(DATA_DIR, name);
      if (!(await fs.stat(filePath)).isFile()) return res.status(404).json({ error: 'File not found' });
      const csvString = await fs.readFile(filePath, 'utf8');
      const records = parse(csvString, { skip_empty_lines: true });
      csvCache[name] = records;
    }
    const data = csvCache[name];
    const header = data[0];
    const idx = header.indexOf(column);
    if (idx === -1) return res.status(404).json({ error: 'Column not found' });
    const values = data.slice(1).map(row => Number(row[idx])).filter(v => !isNaN(v));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 ? (sorted[sorted.length/2-1] + sorted[sorted.length/2])/2 : sorted[Math.floor(sorted.length/2)];
    const min = sorted[0];
    const max = sorted[sorted.length-1];
    const std = Math.sqrt(values.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / values.length);
    const count = values.length;
    const summary = { mean, median, min, max, std, count };
    summaryCache[cacheKey] = summary;
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate summary', details: err.message });
  }
});

// Endpoint to get sensor columns for a given CSV file
app.get('/api/sensors', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing file name' });
  if (sensorCache[name]) return res.json(sensorCache[name]);
  const filePath = path.join(DATA_DIR, name);
  try {
    if (!(await fs.stat(filePath)).isFile()) return res.status(404).json({ error: 'File not found' });
    const csvString = await fs.readFile(filePath, 'utf8');
    const records = parse(csvString, { skip_empty_lines: true });
    const header = records[0] || [];
    const sensors = header.filter(h => h && !NON_SENSOR_COLUMNS.map(normalize).includes(normalize(h)));
    sensorCache[name] = sensors;
    res.json(sensors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get sensors', details: err.message });
  }
});

// --- Correlation Matrix Endpoint ---
const correlationCache = {};
app.get('/api/correlation', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing file name' });
  if (correlationCache[name]) return res.json(correlationCache[name]);
  const filePath = path.join(DATA_DIR, name);
  try {
    if (!(await fs.stat(filePath)).isFile()) return res.status(404).json({ error: 'File not found' });
    const csvString = await fs.readFile(filePath, 'utf8');
    const records = parse(csvString, { skip_empty_lines: true });
    const header = records[0] || [];
    const rows = records.slice(1).filter(r => r.length > 1);
    const sensors = header.filter(h => h && !NON_SENSOR_COLUMNS.map(normalize).includes(normalize(h)));
    const sensorCols = sensors.map(s => header.findIndex(h => normalize(h) === normalize(s))).filter(i => i !== -1);
    // Compute correlation matrix
    const matrix = sensorCols.map(i => sensorCols.map(j => {
      const xi = rows.map(r => Number(r[i]));
      const xj = rows.map(r => Number(r[j]));
      const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
      const mi = mean(xi), mj = mean(xj);
      const cov = xi.map((v, idx) => (v - mi) * (xj[idx] - mj)).reduce((a, b) => a + b, 0) / xi.length;
      const std = arr => Math.sqrt(arr.map(v => (v - mean(arr)) ** 2).reduce((a, b) => a + b, 0) / arr.length);
      const si = std(xi), sj = std(xj);
      return (si && sj) ? cov / (si * sj) : 0;
    }));
    const result = { sensors, matrix };
    correlationCache[name] = result;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate correlation', details: err.message });
  }
});

// --- Boxplot Endpoint ---
const boxplotCache = {};
app.get('/api/boxplot', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing file name' });
  if (boxplotCache[name]) return res.json(boxplotCache[name]);
  const filePath = path.join(DATA_DIR, name);
  try {
    if (!(await fs.stat(filePath)).isFile()) return res.status(404).json({ error: 'File not found' });
    const csvString = await fs.readFile(filePath, 'utf8');
    const records = parse(csvString, { skip_empty_lines: true });
    const header = records[0] || [];
    const rows = records.slice(1).filter(r => r.length > 1);
    const sensors = header.filter(h => h && !NON_SENSOR_COLUMNS.map(normalize).includes(normalize(h)));
    const stats = {};
    sensors.forEach(sensor => {
      const idx = header.findIndex(h => normalize(h) === normalize(sensor));
      const values = rows.map(r => Number(r[idx])).filter(v => !isNaN(v)).sort((a, b) => a - b);
      if (!values.length) return;
      const q1 = values[Math.floor(values.length * 0.25)];
      const median = values[Math.floor(values.length * 0.5)];
      const q3 = values[Math.floor(values.length * 0.75)];
      const min = values[0];
      const max = values[values.length - 1];
      // Tukey outliers
      const iqr = q3 - q1;
      const lower = q1 - 1.5 * iqr;
      const upper = q3 + 1.5 * iqr;
      const outliers = values.filter(v => v < lower || v > upper);
      stats[sensor] = { min, q1, median, q3, max, outliers, values };
    });
    const result = { sensors, stats };
    boxplotCache[name] = result;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate boxplot', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 