//import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const API_URL = process.env.REACT_APP_API_URL || 'https://voc-analytics-dashboard.onrender.com/api';
const NON_SENSOR_COLUMNS = [
  'SNO', 'Timestamp', 'Phase', 'Heater_Profile', 'Heater_Temparature',
  'Alpha_PID', 'Temp', 'Hum', 'ActiveSensorsArray', 'VOC_Activated',
  'Concentration', 'Distance', 'Distance(ft)'
];
const normalize = h => h && h.replace(/\s+/g, '').toUpperCase();

// Theme colors
const themes = {
  dark: {
    bg: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    sidebar: '#181c24',
    card: '#222b36',
    grid: '#232b36',
    text: '#fff',
    accent: '#90caf9',
    plotBg: 'rgba(0,0,0,0)',
    plotFont: '#fff',
    box: '#43a047',
    line: '#1976d2',
    heatmap: 'YlGnBu',
    corr: 'RdBu',
    error: '#ff5252',
    shadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  light: {
    bg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    sidebar: '#f4f6fa',
    card: '#fff',
    grid: '#f0f4f8',
    text: '#222',
    accent: '#1976d2',
    plotBg: '#fff',
    plotFont: '#222',
    box: '#1976d2',
    line: '#43a047',
    heatmap: 'YlGnBu',
    corr: 'RdBu',
    error: '#d32f2f',
    shadow: '0 2px 8px rgba(0,0,0,0.04)'
  }
};

function calcStats(arr) {
  const nums = arr.filter(v => typeof v === 'number' && !isNaN(v));
  if (!nums.length) return { mean: '-', median: '-', min: '-', max: '-', std: '-', count: 0 };
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0 ? (sorted[sorted.length/2-1] + sorted[sorted.length/2])/2 : sorted[Math.floor(sorted.length/2)];
  const min = sorted[0];
  const max = sorted[sorted.length-1];
  const std = Math.sqrt(nums.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / nums.length);
  return { mean, median, min, max, std, count: nums.length };
}

// --- Additional Analytics ---

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [vocOptions, setVocOptions] = useState([]);
  const [voc, setVoc] = useState('');
  const [fileCache, setFileCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dark');
  const t = themes[theme];
  const [selectedTab, setSelectedTab] = useState('Sensor Charts');
  const tabs = ['Sensor Charts', 'Summary Stats', 'Heatmap', 'Correlation Matrix', 'Boxplot'];
  const [matrixLoading, setMatrixLoading] = useState(false);
  const [boxplotLoading, setBoxplotLoading] = useState(false);
  const [correlationData, setCorrelationData] = useState({});
  const [boxplotData, setBoxplotData] = useState({});

  // Fetch file list on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/files`)
      .then(res => res.json())
      .then(files => {
        setFiles(files);
        const vocs = Array.from(new Set(files.map(f => f.split('_')[0])));
        setVocOptions(vocs);
        setVoc(vocs[0] || '');
        setLoading(false);
      })
      .catch(() => { setError('Failed to load files'); setLoading(false); });
  }, []);

  // Fetch and cache all files for selected VoC
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!voc) return;
    const vocFiles = files.filter(f => f.startsWith(voc));
    if (vocFiles.length === 0) return;
    setLoading(true);
    Promise.all(vocFiles.map(file => {
      if (fileCache[file]) return Promise.resolve({ file, data: fileCache[file] });
      return fetch(`${API_URL}/file?name=${encodeURIComponent(file)}`)
        .then(res => res.json())
        .then(data => ({ file, data }));
    })).then(results => {
      const cache = { ...fileCache };
      results.forEach(({ file, data }) => {
        cache[file] = data;
      });
      setFileCache(cache);
      setLoading(false);
    }).catch(() => { setError('Failed to load data'); setLoading(false); });
  }, [voc, files, fileCache]);

  // Helper to get config name from file
  const getConfig = file => file.split('_')[1];

  // Helper to get sensors from header
  const getSensors = header => header.filter(h => h && !NON_SENSOR_COLUMNS.map(normalize).includes(normalize(h)));

  // Calculate Correlation Matrix when needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedTab !== 'Correlation Matrix' || !voc) return;
    setMatrixLoading(true);
    const vocFiles = files.filter(f => f.startsWith(voc));
    const newData = {};
    setTimeout(() => {
      vocFiles.forEach(file => {
        const data = fileCache[file]?.data || [];
        if (!data.length) return;
        const header = data[0];
        const rows = data.slice(1).filter(r => r.length > 1);
        const sensors = getSensors(header);
        const sensorCols = sensors.map(s => header.findIndex(h => normalize(h) === normalize(s))).filter(i => i !== -1);
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
        newData[file] = { sensors, matrix };
      });
      setCorrelationData(newData);
      setMatrixLoading(false);
    }, 100); // Simulate async
  }, [selectedTab, voc, files, fileCache]);

  // Calculate Boxplot Data when needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedTab !== 'Boxplot' || !voc) return;
    setBoxplotLoading(true);
    const vocFiles = files.filter(f => f.startsWith(voc));
    const newData = {};
    setTimeout(() => {
      vocFiles.forEach(file => {
        const data = fileCache[file]?.data || [];
        if (!data.length) return;
        const header = data[0];
        const rows = data.slice(1).filter(r => r.length > 1);
        const sensors = getSensors(header);
        const boxData = sensors.map(s => {
          const idx = header.findIndex(h => normalize(h) === normalize(s));
          if (idx === -1) return null;
          return {
            y: rows.map(r => Number(r[idx])).filter(v => !isNaN(v)),
            type: 'box',
            name: s,
          };
        }).filter(Boolean);
        newData[file] = boxData;
      });
      setBoxplotData(newData);
      setBoxplotLoading(false);
    }, 100);
  }, [selectedTab, voc, files, fileCache]);

  // Render
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: t.bg, color: t.text }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: t.sidebar, color: t.text, padding: 24, display: 'flex', flexDirection: 'column', gap: 24, boxShadow: t.shadow }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Sensor Analytics</h2>
        <div>
          <label style={{ fontWeight: 500 }}>VoC</label>
          <select style={{ width: '100%', padding: 10, borderRadius: 8, marginTop: 4, marginBottom: 16 }} value={voc} onChange={e => setVoc(e.target.value)}>
            {vocOptions.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <button onClick={() => window.print()} style={{ marginTop: 32, padding: '12px 0', borderRadius: 8, background: 'linear-gradient(90deg,#1976d2,#43a047)', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>Export All Charts</button>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Top Bar with VoC and Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: t.text }}>{voc}</div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              background: 'linear-gradient(90deg,#1976d2,#43a047)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
              marginLeft: 16
            }}
          >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
        {/* Tab Bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                border: 'none',
                background: selectedTab === tab ? 'linear-gradient(90deg,#1976d2,#43a047)' : t.card,
                color: selectedTab === tab ? '#fff' : t.text,
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: selectedTab === tab ? t.shadow : 'none',
                outline: 'none',
                transition: 'background 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Main Content by Tab */}
        {loading && <div className="spinner"></div>}
        {error && <div style={{ color: t.error, fontSize: 18, marginTop: 32 }}>{error}</div>}
        {selectedTab === 'Sensor Charts' && files.filter(f => f.startsWith(voc)).map(file => {
          const data = fileCache[file]?.data || [];
          if (!data.length) return null;
          const header = data[0];
          const rows = data.slice(1).filter(r => r.length > 1);
          const sensors = getSensors(header);
          return (
            <div key={file} style={{ marginBottom: 48 }}>
              <h3 style={{ color: t.accent, marginBottom: 12 }}>{getConfig(file)}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
                {sensors.map(sensor => {
                  const idx = header.findIndex(h => normalize(h) === normalize(sensor));
                  const sensorVals = idx !== -1 ? rows.map(r => Number(r[idx])).filter(v => !isNaN(v)) : [];
                  const stats = calcStats(sensorVals);
                  return (
                    <div key={sensor} style={{ background: t.grid, borderRadius: 16, padding: 24, color: t.text, minWidth: 320, minHeight: 320, flex: '1 1 320px', display: 'flex', flexDirection: 'column' }}>
                      <b style={{ marginBottom: 8 }}>{sensor}</b>
                      <div style={{ fontSize: 14, color: t.accent, marginBottom: 8 }}>Mean: {stats.mean !== '-' ? stats.mean.toFixed(3) : '-'}, Std: {stats.std !== '-' ? stats.std.toFixed(3) : '-'}</div>
                      <Plot data={[{ x: rows.map((_, i) => i + 1), y: sensorVals, type: 'scatter', mode: 'lines+markers', marker: { color: t.line }, name: sensor }]} layout={{ autosize: true, responsive: true, paper_bgcolor: t.plotBg, plot_bgcolor: t.plotBg, font: { color: t.plotFont }, xaxis: { title: 'Sample Index' }, yaxis: { title: sensor }, margin: { t: 32, l: 48, r: 24, b: 48 } }} useResizeHandler={true} style={{ width: '100%', height: 200 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {selectedTab === 'Summary Stats' && files.filter(f => f.startsWith(voc)).map(file => {
          const data = fileCache[file]?.data || [];
          if (!data.length) return null;
          const header = data[0];
          const rows = data.slice(1).filter(r => r.length > 1);
          const sensors = getSensors(header);
          return (
            <div key={file} style={{ marginBottom: 48 }}>
              <h3 style={{ color: t.accent, marginBottom: 12 }}>{getConfig(file)}</h3>
              <table style={{ width: '100%', background: t.card, borderRadius: 12, color: t.text, marginBottom: 16 }}>
                <thead>
                  <tr>
                    <th style={{ padding: 8 }}>Sensor</th>
                    <th style={{ padding: 8 }}>Mean</th>
                    <th style={{ padding: 8 }}>Median</th>
                    <th style={{ padding: 8 }}>Min</th>
                    <th style={{ padding: 8 }}>Max</th>
                    <th style={{ padding: 8 }}>Std</th>
                    <th style={{ padding: 8 }}>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {sensors.map(sensor => {
                    const idx = header.findIndex(h => normalize(h) === normalize(sensor));
                    const sensorVals = idx !== -1 ? rows.map(r => Number(r[idx])).filter(v => !isNaN(v)) : [];
                    const stats = calcStats(sensorVals);
                    return (
                      <tr key={sensor}>
                        <td style={{ padding: 8 }}>{sensor}</td>
                        <td style={{ padding: 8 }}>{stats.mean !== '-' ? stats.mean.toFixed(3) : '-'}</td>
                        <td style={{ padding: 8 }}>{stats.median !== '-' ? stats.median.toFixed(3) : '-'}</td>
                        <td style={{ padding: 8 }}>{stats.min !== '-' ? stats.min.toFixed(3) : '-'}</td>
                        <td style={{ padding: 8 }}>{stats.max !== '-' ? stats.max.toFixed(3) : '-'}</td>
                        <td style={{ padding: 8 }}>{stats.std !== '-' ? stats.std.toFixed(3) : '-'}</td>
                        <td style={{ padding: 8 }}>{stats.count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
        {selectedTab === 'Heatmap' && files.filter(f => f.startsWith(voc)).map(file => {
          const data = fileCache[file]?.data || [];
          if (!data.length) return null;
          const header = data[0];
          const rows = data.slice(1).filter(r => r.length > 1);
          const sensors = getSensors(header);
          const sensorCols = sensors.map(s => header.findIndex(h => normalize(h) === normalize(s))).filter(i => i !== -1);
          const z = sensorCols.map(si => rows.map(r => Number(r[si])));
          return (
            <div key={file} style={{ marginBottom: 48 }}>
              <h3 style={{ color: t.accent, marginBottom: 12 }}>{getConfig(file)}</h3>
              <Plot data={[{ z, x: rows.map((_, i) => i + 1), y: sensors, type: 'heatmap', colorscale: t.heatmap }]} layout={{ autosize: true, responsive: true, paper_bgcolor: t.plotBg, plot_bgcolor: t.plotBg, font: { color: t.plotFont }, xaxis: { title: 'Sample Index' }, yaxis: { title: 'Sensors' }, margin: { t: 32, l: 48, r: 24, b: 48 } }} useResizeHandler={true} style={{ width: '100%', height: 320 }} />
            </div>
          );
        })}
        {selectedTab === 'Correlation Matrix' && files.filter(f => f.startsWith(voc)).map(file => {
          if (matrixLoading) return <div className="spinner"></div>;
          const corr = correlationData[file];
          if (!corr) return null;
          return (
            <div key={file} style={{ marginBottom: 48 }}>
              <h3 style={{ color: t.accent, marginBottom: 12 }}>{getConfig(file)}</h3>
              <Plot data={[{ z: corr.matrix, x: corr.sensors, y: corr.sensors, type: 'heatmap', colorbar: { title: 'Correlation' }, colorscale: t.corr, zmin: -1, zmax: 1 }]} layout={{ autosize: true, responsive: true, paper_bgcolor: t.plotBg, plot_bgcolor: t.plotBg, font: { color: t.plotFont }, margin: { t: 32, l: 48, r: 24, b: 48 } }} useResizeHandler={true} style={{ width: '100%', height: 320 }} />
            </div>
          );
        })}
        {selectedTab === 'Boxplot' && files.filter(f => f.startsWith(voc)).map(file => {
          if (boxplotLoading) return <div className="spinner"></div>;
          const box = boxplotData[file];
          if (!box) return null;
          return (
            <div key={file} style={{ marginBottom: 48 }}>
              <h3 style={{ color: t.accent, marginBottom: 12 }}>{getConfig(file)}</h3>
              <Plot data={box} layout={{ autosize: true, responsive: true, paper_bgcolor: t.plotBg, plot_bgcolor: t.plotBg, font: { color: t.plotFont }, boxmode: 'group', yaxis: { title: 'Sensor Value' }, margin: { t: 32, l: 48, r: 24, b: 48 } }} useResizeHandler={true} style={{ width: '100%', height: 320 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
} 