const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { parse } = require('csv-parse/sync');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_DIR = path.resolve(__dirname, '../');

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow specific origins
    const allowedOrigins = [
      'https://venerable-smakager-91d079.netlify.app',
      'https://netlify.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors());

// Add CORS headers to all responses
app.use((req, res, next) => {
  // Set CORS headers on every request
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Override res.json to always include CORS headers
const originalJson = express.response.json;
express.response.json = function(data) {
  this.header('Access-Control-Allow-Origin', '*');
  this.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  this.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  return originalJson.call(this, data);
};

// Override res.send to always include CORS headers
const originalSend = express.response.send;
express.response.send = function(data) {
  this.header('Access-Control-Allow-Origin', '*');
  this.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  this.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  return originalSend.call(this, data);
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KnoseGit Backend Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// CORS test endpoint
app.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS test successful',
    headers: {
      'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': res.getHeader('Access-Control-Allow-Headers')
    },
    timestamp: new Date().toISOString()
  });
});

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

// List all Phase2 CSV files
app.get('/api/phase2-files', async (req, res) => {
  try {
    const phase2Dir = path.join(DATA_DIR, 'dashboard_local', 'public', 'Phase2');
    const allFiles = await fs.readdir(phase2Dir);
    const files = allFiles.filter(f => f.endsWith('.csv'));
    res.json(files);
  } catch (err) {
    console.error('Error listing Phase2 files:', err);
    res.status(500).json({ error: 'Failed to list Phase2 files', details: err.message });
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

// Serve the contents of a selected Phase2 CSV file as JSON
app.get('/api/phase2-file', async (req, res) => {
  const { name, columns } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing file name' });
  const filePath = path.join(DATA_DIR, 'dashboard_local', 'public', 'Phase2', name);
      try {
      // Check cache first
      if (!csvCache[name]) {
        if (!(await fs.stat(filePath)).isFile()) {
          return res.status(404).json({ error: 'File not found' });
        }
        const csvString = await fs.readFile(filePath, 'utf8');
        const records = parse(csvString, { skip_empty_lines: true });
        csvCache[name] = records;
      }
    let data = csvCache[name];
    
    // Convert array of arrays to array of objects
    const header = data[0];
    const rows = data.slice(1);
    const objectData = rows.map(row => {
      const obj = {};
      header.forEach((col, index) => {
        obj[col.trim()] = row[index] ? row[index].trim() : '';
      });
      return obj;
    });
    
    res.json({ name, data: objectData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read Phase2 file', details: err.message });
  }
});

// Serve Phase2 CSV files directly (for frontend access)
app.get('/Phase2/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(DATA_DIR, 'dashboard_local', 'public', 'Phase2', filename);
  
  try {
    if (!(await fs.stat(filePath)).isFile()) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const csvString = await fs.readFile(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvString);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read Phase2 file', details: err.message });
  }
});

// List all Baseline CSV files
app.get('/api/baseline-files', async (req, res) => {
  try {
    const baselineDir = path.join(DATA_DIR, 'dashboard_local', 'public', 'Baseline');
    const allFiles = await fs.readdir(baselineDir);
    const files = allFiles.filter(f => f.endsWith('.csv'));
    
    // Sort files by date and type for better organization
    const sortedFiles = files.sort((a, b) => {
      // Prioritize merged files
      const aIsMerged = a.includes('merge');
      const bIsMerged = b.includes('merge');
      if (aIsMerged && !bIsMerged) return -1;
      if (!aIsMerged && bIsMerged) return 1;
      
      // Then sort by date (newer first)
      const aDate = a.match(/(\d{2})_(\w{3})/);
      const bDate = b.match(/(\d{2})_(\w{3})/);
      if (aDate && bDate) {
        const aDay = parseInt(aDate[1]);
        const bDay = parseInt(bDate[1]);
        return bDay - aDay;
      }
      return a.localeCompare(b);
    });
    
    res.json(sortedFiles);
  } catch (err) {
    console.error('Error listing Baseline files:', err);
    res.status(500).json({ error: 'Failed to list Baseline files', details: err.message });
  }
});

// Serve the contents of a selected Baseline CSV file as JSON
app.get('/api/baseline-file', async (req, res) => {
  const { filename } = req.query;
  if (!filename) return res.status(400).json({ error: 'Missing filename' });
  
  try {
    const filePath = path.join(DATA_DIR, 'dashboard_local', 'public', 'Baseline', filename);
    
    // Check cache first
    if (!csvCache[filename]) {
      if (!(await fs.stat(filePath)).isFile()) {
        return res.status(404).json({ error: 'File not found' });
      }
      const csvString = await fs.readFile(filePath, 'utf8');
      const records = parse(csvString, { skip_empty_lines: true });
      csvCache[filename] = records;
    }
    
    let data = csvCache[filename];
    
    // Convert array of arrays to array of objects
    const header = data[0];
    const rows = data.slice(1);
    const objectData = rows.map(row => {
      const obj = {};
      header.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
    
    res.json(objectData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read file', details: err.message });
  }
});

// --- Summary Endpoint ---
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

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    message: `The route ${req.originalUrl} does not exist`,
    availableRoutes: [
      '/',
      '/api/files',
      '/api/phase2-files',
      '/api/file',
      '/api/phase2-file',
      '/Phase2/:filename',
      '/api/summary',
      '/api/sensors',
      '/api/correlation',
      '/api/boxplot'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for all origins`);
}); 