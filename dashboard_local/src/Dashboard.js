//import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useNavigate } from 'react-router-dom';

// Frontend-only solution - no backend needed
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

function computeAllStats(data) {
  if (!data || !data.length) return {};
  const header = data[0];
  const rows = data.slice(1).filter(r => r.length > 1);
  // Universal sensor list for all files
  const sensorNames = [
    'MQ136', 'MQ138_A', 'MQ138_B', 'BME688_D', 'BME688_C', 'TGS2602', 'TGS 2602', 'SPEC'
  ];
  const sensors = header.filter(h => sensorNames.includes(h));
        // Header and sensors processed

  // Per-sensor stats
  const sensorStats = {};
  sensors.forEach(sensor => {
    const idx = header.findIndex(h => normalize(h) === normalize(sensor));
    const vals = idx !== -1 ? rows.map(r => Number(r[idx])).filter(v => !isNaN(v)) : [];
    sensorStats[sensor] = calcStats(vals);
  });

  // Correlation matrix
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

  // Boxplot data
  const boxData = sensors.map(s => {
    const idx = header.findIndex(h => normalize(h) === normalize(s));
    if (idx === -1) return null;
    return {
      y: rows.map(r => Number(r[idx])).filter(v => !isNaN(v)),
      type: 'box',
      name: s,
    };
  }).filter(Boolean);

  // Heatmap data
  const z = sensorCols.map(si => rows.map(r => Number(r[si])));

  return {
    header,
    rows,
    sensors,
    sensorStats,
    correlation: { sensors, matrix },
    boxData,
    heatmap: { sensors, z, rows }
  };
}

// --- Additional Analytics ---

// Helper to group rows by Phase, Heater_Profile, Heater_Temparature
function groupRowsByKey(rows, header) {
  const phaseIdx = header.indexOf('Phase');
  const profileIdx = header.indexOf('Heater_Profile');
  const tempIdx = header.indexOf('Heater_Temparature');
  const groups = {};
  rows.forEach(row => {
    const key = `${row[phaseIdx]}|${row[profileIdx]}|${row[tempIdx]}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  });
  return groups;
}

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [vocOptions, setVocOptions] = useState([]);
  const [voc, setVoc] = useState('');
  const [fileCache, setFileCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dark');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [csvTab, setCsvTab] = useState('raw');
  const [csvSearch, setCsvSearch] = useState('');
  const [csvSort, setCsvSort] = useState({ col: null, asc: true });
  const [csvVisibleCols, setCsvVisibleCols] = useState(new Set());
  const [boxplotSensors, setBoxplotSensors] = useState(new Set());
  const t = themes[theme];

  // Define tabs
  const tabs = ['overview', 'correlation', 'boxplots', 'csv'];

  const navigate = useNavigate();

  // Helper to download CSV
  function downloadCSV(filename, rows) {
    const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Helper to copy CSV to clipboard
  function copyCSV(rows) {
    const csv = rows.map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  }





  function handleLogout() {
    // Clear login state (if any)
    localStorage.clear();
    sessionStorage.clear();
    navigate('/options');
  }

  function handleBackToOptions() {
    navigate('/options');
  }



  function sortRows(rows, colIdx, asc) {
    if (colIdx == null) return rows;
    const header = rows[0];
    const body = rows.slice(1).slice();
    body.sort((a, b) => {
      const aVal = a[colIdx];
      const bVal = b[colIdx];
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return asc ? aNum - bNum : bNum - aNum;
      }
      return asc ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return [header, ...body];
  }

  function exportFilteredCSV(filename, rows) {
    downloadCSV(filename.replace(/\.csv$/, '_filtered.csv'), rows);
  }

  // Helper functions for UI interactions
  function toggleBoxplotSensor(sensor) {
    const newSet = new Set(boxplotSensors);
    if (newSet.has(sensor)) {
      newSet.delete(sensor);
    } else {
      newSet.add(sensor);
    }
    setBoxplotSensors(newSet);
  }

  function toggleCol(col) {
    const newSet = new Set(csvVisibleCols);
    if (newSet.has(col)) {
      newSet.delete(col);
    } else {
      newSet.add(col);
    }
    setCsvVisibleCols(newSet);
  }

  // Load file list from public folder
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLoading(true);
    // Load files directly from public folder
    const files = [
      '1-Octen-3-ol_Config1_Diaper.csv',
      'Ammonia_Config1_Diaper.csv', 
      'Cresol_Config1_Diaper.csv',
      'Cresol_Config2_Diaper.csv',
      'DS_Config1_Diaper.csv',
      'Toluene_Config1_Diaper.csv',
      'Toluene_Config2_Diaper.csv'
    ];
    setFiles(files);
    const vocs = Array.from(new Set(files.map(f => f.split('_')[0])));
    setVocOptions(vocs);
    setVoc(vocs[0] || '');
    setLoading(false);
  }, []);

  // Fetch and cache all files for selected VoC
  useEffect(() => {
    if (!voc) return;
    const vocFiles = files.filter(f => f.split('_')[0] === voc);
    if (vocFiles.length === 0) return;
    setLoading(true);
    Promise.all(vocFiles.map(file => {
      if (fileCache[file]) return Promise.resolve({ file, data: fileCache[file] });
      return fetch(`/VOC_Data/${file}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          return res.text();
        })
        .then(csvText => {
          // Parse CSV data
          const lines = csvText.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          const rows = [];
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.trim());
              const row = {};
              headers.forEach((header, index) => { row[header] = values[index] || ''; });
              rows.push(row);
            }
          }
          const allStats = computeAllStats(rows);
          return { file, data: allStats };
        });
    })).then(results => {
      const cache = { ...fileCache };
      results.forEach(({ file, data }) => {
        cache[file] = data;
      });
      setFileCache(cache);
      setLoading(false);
    }).catch(() => { setError('Failed to load data'); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voc, files]);

  // Helper to get config name from file
  const getConfig = file => file.split('_')[1];

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
          <div style={{ display: 'flex', gap: 12 }}>
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
            <button
              onClick={handleBackToOptions}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: t.accent,
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
                marginLeft: 0
              }}
            >
              ← Back
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: t.error,
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
                marginLeft: 8
              }}
            >
              Logout
            </button>
          </div>
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
        {selectedTab === 'overview' && files.filter(f => f.split('_')[0] === voc).map(file => {
          const stats = fileCache[file];
          if (!stats || !Array.isArray(stats.sensors) || stats.sensors.length === 0) return <div key={file} style={{ color: t.error, marginBottom: 24 }}>No sensor data available for this file.</div>;
          return (
            <div key={file} style={{ marginBottom: 48 }}>
              <h3 style={{ color: t.accent, marginBottom: 12 }}>{getConfig(file)}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
                {stats.sensors.map(sensor => (
                    <div key={sensor} style={{ background: t.grid, borderRadius: 16, padding: 24, color: t.text, minWidth: 320, minHeight: 320, flex: '1 1 320px', display: 'flex', flexDirection: 'column' }}>
                      <b style={{ marginBottom: 8 }}>{sensor}</b>
                    <div style={{ fontSize: 14, color: t.accent, marginBottom: 8 }}>
                      Mean: {stats.sensorStats[sensor].mean !== '-' ? stats.sensorStats[sensor].mean.toFixed(3) : '-'}, Std: {stats.sensorStats[sensor].std !== '-' ? stats.sensorStats[sensor].std.toFixed(3) : '-'}
                    </div>
                    <Plot data={[{ x: stats.rows.map((_, i) => i + 1), y: stats.rows.map(r => Number(r[stats.header.findIndex(h => normalize(h) === normalize(sensor))])).filter(v => !isNaN(v)), type: 'scatter', mode: 'lines+markers', marker: { color: t.line }, name: sensor }]} layout={{ autosize: true, responsive: true, paper_bgcolor: t.plotBg, plot_bgcolor: t.plotBg, font: { color: t.plotFont }, xaxis: { title: 'Sample Index' }, yaxis: { title: sensor }, margin: { t: 32, l: 48, r: 24, b: 48 } }} useResizeHandler={true} style={{ width: '100%', height: 200 }} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {selectedTab === 'correlation' && files.filter(f => f.split('_')[0] === voc).map(file => {
          const stats = fileCache[file];
          if (!stats || !Array.isArray(stats.sensors) || stats.sensors.length === 0) return <div key={file} style={{ color: t.error, marginBottom: 24 }}>No sensor data available for this file.</div>;
          // Group rows by Phase, Heater_Profile, Heater_Temparature
          const groups = groupRowsByKey(stats.rows, stats.header);
          return (
            <div key={file} style={{ marginBottom: 32 }}>
              <h3 style={{ color: t.accent, marginBottom: 8, fontSize: 18 }}>{getConfig(file)}</h3>
              {Object.entries(groups).map(([groupKey, groupRows], groupIdx) => {
                const [phase, profile, temp] = groupKey.split('|');
                // For each sensor, calculate stats for this group
                const groupSensorStats = {};
                let hasData = false;
                stats.sensors.forEach(sensor => {
                  const idx = stats.header.indexOf(sensor);
                  const vals = groupRows.map(r => Number(r[idx])).filter(v => !isNaN(v));
                  groupSensorStats[sensor] = calcStats(vals);
                  if (vals.length > 0) hasData = true;
                });
                if (!hasData) return null;
                return (
                  <div key={groupKey} style={{ marginBottom: 12, border: '1px solid #e0e0e0', borderRadius: 7, background: t.card, boxShadow: t.shadow, padding: 6 }}>
                    <div style={{ fontWeight: 600, color: t.accent, marginBottom: 2, fontSize: 14, background: t.grid, position: 'sticky', left: 0, zIndex: 2, padding: 4, borderRadius: 5 }}>
                      Phase: {phase}, Heater_Profile: {profile}, Heater_Temparature: {temp} <span style={{ color: t.text, fontWeight: 400, fontSize: 13 }}>({groupRows.length} samples)</span>
                    </div>
                    <div style={{ overflowX: 'auto', borderRadius: 5 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 5, fontSize: 13, minWidth: 520 }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                          <tr style={{ background: t.grid }}>
                            <th style={{ padding: 6, color: t.accent, fontWeight: 700, fontSize: 13, textAlign: 'left', position: 'sticky', top: 0, borderBottom: '1px solid #e0e0e0' }}>Sensor</th>
                            <th style={{ padding: 6, color: t.accent, fontWeight: 700, fontSize: 13, textAlign: 'right', position: 'sticky', top: 0, borderBottom: '1px solid #e0e0e0' }}>Mean</th>
                            <th style={{ padding: 6, color: t.accent, fontWeight: 700, fontSize: 13, textAlign: 'right', position: 'sticky', top: 0, borderBottom: '1px solid #e0e0e0' }}>Median</th>
                            <th style={{ padding: 6, color: t.accent, fontWeight: 700, fontSize: 13, textAlign: 'right', position: 'sticky', top: 0, borderBottom: '1px solid #e0e0e0' }}>Min</th>
                            <th style={{ padding: 6, color: t.accent, fontWeight: 700, fontSize: 13, textAlign: 'right', position: 'sticky', top: 0, borderBottom: '1px solid #e0e0e0' }}>Max</th>
                            <th style={{ padding: 6, color: t.accent, fontWeight: 700, fontSize: 13, textAlign: 'right', position: 'sticky', top: 0, borderBottom: '1px solid #e0e0e0' }}>Std</th>
                            <th style={{ padding: 6, color: t.accent, fontWeight: 700, fontSize: 13, textAlign: 'right', position: 'sticky', top: 0, borderBottom: '1px solid #e0e0e0' }}>Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.sensors.map((sensor, idx) => {
                            const s = groupSensorStats[sensor];
                            return (
                              <tr key={sensor} style={{ background: idx % 2 === 0 ? t.card : t.grid, transition: 'background 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = t.accent + '22'}
                                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? t.card : t.grid}>
                                <td style={{ padding: 5, fontWeight: 500, color: t.text, borderBottom: '1px solid #e0e0e0' }}>{sensor}</td>
                                <td style={{ padding: 5, textAlign: 'right', color: t.accent, borderBottom: '1px solid #e0e0e0' }}>{s.mean !== '-' ? s.mean.toFixed(3) : '-'}</td>
                                <td style={{ padding: 5, textAlign: 'right', color: t.text, borderBottom: '1px solid #e0e0e0' }}>{s.median !== '-' ? s.median.toFixed(3) : '-'}</td>
                                <td style={{ padding: 5, textAlign: 'right', color: t.text, borderBottom: '1px solid #e0e0e0' }}>{s.min !== '-' ? s.min.toFixed(3) : '-'}</td>
                                <td style={{ padding: 5, textAlign: 'right', color: t.text, borderBottom: '1px solid #e0e0e0' }}>{s.max !== '-' ? s.max.toFixed(3) : '-'}</td>
                                <td style={{ padding: 5, textAlign: 'right', color: t.text, borderBottom: '1px solid #e0e0e0' }}>{s.std !== '-' ? s.std.toFixed(3) : '-'}</td>
                                <td style={{ padding: 5, textAlign: 'right', color: t.text, borderBottom: '1px solid #e0e0e0' }}>{s.count}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {selectedTab === 'boxplots' && files.filter(f => f.split('_')[0] === voc).map(file => {
          const stats = fileCache[file];
          if (!stats || !Array.isArray(stats.sensors) || stats.sensors.length === 0) return <div key={file} style={{ color: t.error, marginBottom: 24 }}>No sensor data available for this file.</div>;
          const allSensors = stats.sensors;
          const selectedSensors = allSensors.filter(s => boxplotSensors[s] !== false);
          return (
            <div key={file} style={{ marginBottom: 48 }}>
              <h3 style={{ color: t.accent, marginBottom: 12 }}>{getConfig(file)}</h3>
              <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {allSensors.map(sensor => (
                  <label key={sensor} style={{ color: t.text, fontWeight: 500, fontSize: 15, marginRight: 12 }}>
                    <input type="checkbox" checked={boxplotSensors[sensor] !== false} onChange={() => toggleBoxplotSensor(sensor)} /> {sensor}
                  </label>
                ))}
              </div>
              <Plot data={Array.isArray(stats.boxData) ? stats.boxData.filter(b => selectedSensors.includes(b.name)) : []} layout={{ autosize: true, responsive: true, paper_bgcolor: t.plotBg, plot_bgcolor: t.plotBg, font: { color: t.plotFont }, boxmode: 'group', yaxis: { title: 'Sensor Value' }, margin: { t: 32, l: 48, r: 24, b: 48 } }} useResizeHandler={true} style={{ width: '100%', height: 320 }} />
            </div>
          );
        })}
        {selectedTab === 'csv' && (() => {
          const vocFiles = files.filter(f => f.split('_')[0] === voc);
          if (!vocFiles.length) return <div>No files found for this VoC.</div>;
          const file = vocFiles[csvTab];
          const stats = fileCache[file];
          if (!stats) return <div>Loading...</div>;
          let rows = stats.header && stats.rows ? [stats.header, ...stats.rows] : [];
          if (!Array.isArray(rows) || rows.length === 0) return <div>No data available for this file.</div>;
          // Filter rows if search is active
          if (csvSearch) {
            const searchLower = csvSearch.toLowerCase();
            rows = [rows[0], ...rows.slice(1).filter(row => row.some(cell => String(cell).toLowerCase().includes(searchLower)))]
          }
          // Column visibility
          // Sorting
          if (csvSort.col != null) {
            rows = sortRows(rows, csvSort.col, csvSort.asc);
          }
          return (
            <div>
              {/* Sub-tabs for each file */}
              {vocFiles.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {vocFiles.map((f, i) => (
                    <button
                      key={f}
                      onClick={() => setCsvTab(i)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: 8,
                        border: 'none',
                        background: i === csvTab ? 'linear-gradient(90deg,#1976d2,#43a047)' : t.card,
                        color: i === csvTab ? '#fff' : t.text,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: 'pointer',
                        boxShadow: i === csvTab ? t.shadow : 'none',
                        outline: 'none',
                        transition: 'background 0.2s',
                      }}
                    >
                      {getConfig(f)}
                    </button>
                  ))}
                </div>
              )}
              {/* CSV Utilities */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                <button onClick={() => downloadCSV(file, [stats.header, ...stats.rows])} style={{ padding: '8px 16px', borderRadius: 8, background: t.accent, color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Download CSV</button>
                <button onClick={() => copyCSV([stats.header, ...stats.rows])} style={{ padding: '8px 16px', borderRadius: 8, background: t.line, color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Copy to Clipboard</button>
                <button onClick={() => exportFilteredCSV(file, rows)} style={{ padding: '8px 16px', borderRadius: 8, background: t.box, color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Export Filtered</button>
                <input type="text" placeholder="Search..." value={csvSearch} onChange={e => setCsvSearch(e.target.value)} style={{ padding: '8px', borderRadius: 8, border: '1px solid #ccc', minWidth: 180 }} />
                <span style={{ color: t.text, fontSize: 15 }}>
                  Rows: {rows.length - 1}, Columns: {rows[0]?.length || 0}
                </span>
                {/* Column visibility toggles */}
                <span style={{ color: t.text, fontSize: 15 }}>Columns:</span>
                {rows[0]?.map((col, i) => (
                  <label key={col} style={{ marginRight: 8, color: t.text, fontSize: 14 }}>
                    <input type="checkbox" checked={csvVisibleCols[col] !== false} onChange={() => toggleCol(col)} /> {col}
                  </label>
                ))}
              </div>
              {/* CSV Table */}
              <div style={{ overflowX: 'auto', maxHeight: 480, borderRadius: 8, boxShadow: t.shadow, background: t.card }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr>
                      {rows[0]?.map((cell, i) => csvVisibleCols[cell] !== false && (
                        <th
                          key={i}
                          style={{ padding: 8, background: t.grid, color: t.accent, position: 'sticky', top: 0, zIndex: 1, cursor: 'pointer' }}
                          onClick={() => setCsvSort(s => ({ col: i, asc: s.col === i ? !s.asc : true }))}
                        >
                          {cell} {csvSort.col === i ? (csvSort.asc ? '▲' : '▼') : ''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(1).map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => csvVisibleCols[rows[0][j]] !== false && (
                          <td key={j} style={{ padding: 8, borderBottom: '1px solid #eee', color: t.text }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
} 