import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    display: 'flex',
  },
  sidebar: {
    width: '280px',
    background: 'rgba(0,0,0,0.2)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(255,255,255,0.1)',
  },
  mainContent: {
    flex: 1,
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: '20px',
    textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  backButtonHover: {
    background: 'rgba(255,255,255,0.3)',
    transform: 'scale(1.05)',
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '15px',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '14px',
    marginBottom: '15px',
  },
  button: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    marginBottom: '10px',
  },
  buttonHover: {
    background: 'linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)',
    transform: 'scale(1.02)',
  },
  card: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '25px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '20px',
    color: '#fff',
    borderBottom: '2px solid rgba(255,255,255,0.3)',
    paddingBottom: '10px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  statItem: {
    background: 'rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#4fc3f7',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
  },
  heaterProfileSection: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '15px',
  },
  heaterProfileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '15px',
  },
  heaterProfileCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  heaterProfileTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#4fc3f7',
    marginBottom: '15px',
    textAlign: 'center',
  },
  phaseSection: {
    marginBottom: '15px',
  },
  phaseTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '10px',
    padding: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '6px',
  },
  sensorStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '8px',
    marginBottom: '10px',
  },
  sensorStat: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    padding: '6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
  },
  sensorStatValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#4fc3f7',
  },
  csvViewer: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '15px',
    maxHeight: '400px',
    overflow: 'auto',
  },
  csvTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.8rem',
  },
  csvHeader: {
    background: 'rgba(255,255,255,0.1)',
    padding: '8px',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    position: 'sticky',
    top: 0,
  },
  csvCell: {
    padding: '6px 8px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.75rem',
  },
  loading: {
    textAlign: 'center',
    color: '#fff',
    fontSize: '1.2rem',
    marginTop: '50px',
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontSize: '1.2rem',
    marginTop: '50px',
  },
  fileSelector: {
    marginBottom: '20px',
  },
  fileSelectorLabel: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '8px',
    display: 'block',
  },
  // Tab styles
  tabContainer: {
    display: 'flex',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '5px',
    marginBottom: '20px',
    backdropFilter: 'blur(10px)',
  },
  tab: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  activeTab: {
    background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  tabContent: {
    display: 'none',
  },
  activeTabContent: {
    display: 'block',
  },
  chartContainer: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
  },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '20px',
    marginTop: '15px',
  },
};

export default function Phase2Dashboard() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState('01Aug_Phase2_Ammonia.csv');
  const [availableFiles] = useState([
    '01Aug_Phase2_Ammonia.csv'
  ]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, [selectedFile]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/Phase2/${selectedFile}`);
      if (!response.ok) {
        throw new Error('Failed to load data');
      }
      const csvText = await response.text();
      const parsedData = parseCSV(csvText);
      setData(parsedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',');
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index] ? values[index].trim() : '';
      });
      return row;
    });
    return data;
  };

  const calculateDetailedStats = (data) => {
    if (!data || data.length === 0) return {};

    const phases = ['Pre-Puff', 'Puff', 'Post-Puff'];
    const sensors = ['BME_HeaterRes', 'MQ136_RAW', 'MQ138_RAW', 'Alpha_PID', 'SPEC', 'SGP40_VOC'];
    const stats = {};

    // Overall stats
    stats.totalRecords = data.length;
    stats.uniqueHeaterProfiles = [...new Set(data.map(row => row.Heater_Profile))].length;
    stats.avgBMEHeaterRes = data.reduce((sum, row) => sum + parseFloat(row.BME_HeaterRes || 0), 0) / data.length;

    // Detailed Heater Profile analysis with nested phase stats
    const heaterProfileStats = {};
    data.forEach(row => {
      const profile = row.Heater_Profile;
      const phase = row.Phase;
      
      if (!heaterProfileStats[profile]) {
        heaterProfileStats[profile] = {
          totalCount: 0,
          phases: {}
        };
        
        // Initialize phase structure
        phases.forEach(phaseName => {
          heaterProfileStats[profile].phases[phaseName] = {
            count: 0,
            sensors: {}
          };
          
          sensors.forEach(sensor => {
            heaterProfileStats[profile].phases[phaseName].sensors[sensor] = {
              values: [],
              min: 0,
              max: 0,
              avg: 0
            };
          });
        });
      }
      
      heaterProfileStats[profile].totalCount++;
      
      if (heaterProfileStats[profile].phases[phase]) {
        heaterProfileStats[profile].phases[phase].count++;
        
        sensors.forEach(sensor => {
          const value = parseFloat(row[sensor] || 0);
          if (!isNaN(value)) {
            heaterProfileStats[profile].phases[phase].sensors[sensor].values.push(value);
          }
        });
      }
    });

    // Calculate min/max/avg for each sensor in each phase for each profile
    Object.keys(heaterProfileStats).forEach(profile => {
      Object.keys(heaterProfileStats[profile].phases).forEach(phase => {
        const phaseData = heaterProfileStats[profile].phases[phase];
        
        sensors.forEach(sensor => {
          const values = phaseData.sensors[sensor].values;
          if (values.length > 0) {
            phaseData.sensors[sensor].min = Math.min(...values);
            phaseData.sensors[sensor].max = Math.max(...values);
            phaseData.sensors[sensor].avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          }
        });
      });
    });

    stats.heaterProfiles = heaterProfileStats;

    // Phase-specific overall stats
    stats.phases = {};
    phases.forEach(phase => {
      const phaseData = data.filter(row => row.Phase === phase);
      if (phaseData.length > 0) {
        stats.phases[phase] = {
          count: phaseData.length,
          sensors: {}
        };
        
        sensors.forEach(sensor => {
          const values = phaseData.map(row => parseFloat(row[sensor] || 0)).filter(v => !isNaN(v));
          if (values.length > 0) {
            stats.phases[phase].sensors[sensor] = {
              min: Math.min(...values),
              max: Math.max(...values),
              avg: values.reduce((sum, val) => sum + val, 0) / values.length
            };
          }
        });
      }
    });

    return stats;
  };

  const generateBellCurveData = (values, sensorName) => {
    if (!values || values.length === 0) return null;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const std = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
    const x = Array.from({ length: 100 }, (_, i) => {
      const xVal = mean - 3 * std + (6 * std * i) / 99;
      return xVal;
    });
    
    const y = x.map(xVal => {
      return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((xVal - mean) / std, 2));
    });
    
    return {
      x: x,
      y: y,
      mean: mean,
      std: std,
      actualValues: values
    };
  };



  const generateCorrelationMatrix = (data) => {
    const sensors = ['BME_HeaterRes', 'MQ136_RAW', 'MQ138_RAW', 'Alpha_PID', 'SPEC', 'SGP40_VOC'];
    const sensorData = {};
    
    sensors.forEach(sensor => {
      sensorData[sensor] = data.map(row => parseFloat(row[sensor] || 0)).filter(v => !isNaN(v));
    });
    
    const correlationMatrix = sensors.map(sensor1 => 
      sensors.map(sensor2 => {
        const x = sensorData[sensor1];
        const y = sensorData[sensor2];
        
        if (x.length === 0 || y.length === 0) return 0;
        
        const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
        const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;
        
        const numerator = x.reduce((sum, val, i) => sum + (val - meanX) * (y[i] - meanY), 0);
        const denominatorX = Math.sqrt(x.reduce((sum, val) => sum + Math.pow(val - meanX, 2), 0));
        const denominatorY = Math.sqrt(y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0));
        
        return denominatorX * denominatorY === 0 ? 0 : numerator / (denominatorX * denominatorY);
      })
    );
    
    return {
      z: correlationMatrix,
      x: sensors,
      y: sensors
    };
  };

  const handleDownloadCSV = () => {
    if (!data) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.replace('.csv', '_export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    navigate('/options');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading Phase 2 Bio Lab Testing Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Error: {error}</div>
      </div>
    );
  }

  const stats = calculateDetailedStats(data);
  const bmeValues = data.map(row => parseFloat(row.BME_HeaterRes || 0)).filter(v => !isNaN(v));
  const mq136Values = data.map(row => parseFloat(row.MQ136_RAW || 0)).filter(v => !isNaN(v));

  const bmeBellCurve = generateBellCurveData(bmeValues, 'BME_HeaterRes');
  const mq136BellCurve = generateBellCurveData(mq136Values, 'MQ136_RAW');
  
  const correlationData = generateCorrelationMatrix(data);

  return (
    <div style={styles.container}>
      <button
        style={hovered ? { ...styles.backButton, ...styles.backButtonHover } : styles.backButton}
        onClick={handleBack}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        ← Back to Options
      </button>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Phase 2 Analytics</h2>
        
        <div style={styles.fileSelector}>
          <label style={styles.fileSelectorLabel}>Select VOC File:</label>
          <select 
            style={styles.select} 
            value={selectedFile} 
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            {availableFiles.map(file => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
        </div>

        <button 
          style={styles.button}
          onClick={handleDownloadCSV}
        >
          📄 Download CSV
        </button>

        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{stats.totalRecords?.toLocaleString()}</div>
            <div style={styles.statLabel}>Total Records</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{stats.uniqueHeaterProfiles}</div>
            <div style={styles.statLabel}>Heater Profiles</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.header}>Phase 2 Bio Lab Testing Dashboard</h1>
        <div style={{ textAlign: 'center', color: '#ff4444', fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>
          On going
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button
            style={activeTab === 'overview' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            style={activeTab === 'profiles' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('profiles')}
          >
            🔥 Heater Profiles
          </button>
          <button
            style={activeTab === 'phases' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('phases')}
          >
            ⏱️ Phase Analysis
          </button>
          <button
            style={activeTab === 'charts' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('charts')}
          >
            📈 Charts & Graphs
          </button>
          <button
            style={activeTab === 'csv' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('csv')}
          >
            📋 CSV Viewer
          </button>
        </div>

        {/* Overview Tab */}
        <div style={activeTab === 'overview' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📊 Overview Statistics</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{stats.totalRecords?.toLocaleString()}</div>
                <div style={styles.statLabel}>Total Records</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{stats.uniqueHeaterProfiles}</div>
                <div style={styles.statLabel}>Unique Heater Profiles</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{stats.avgBMEHeaterRes?.toFixed(0)}</div>
                <div style={styles.statLabel}>Avg BME Heater Res</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>Ammonia</div>
                <div style={styles.statLabel}>VOC Tested</div>
              </div>
            </div>
          </div>
        </div>

        {/* Heater Profiles Tab */}
        <div style={activeTab === 'profiles' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🔥 Detailed Heater Profile Analysis</h2>
            <div style={styles.heaterProfileSection}>
              <div style={styles.heaterProfileGrid}>
                {Object.entries(stats.heaterProfiles || {}).map(([profile, profileStats]) => (
                  <div key={profile} style={styles.heaterProfileCard}>
                    <div style={styles.heaterProfileTitle}>Profile {profile}</div>
                    <div style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '15px', color: 'rgba(255,255,255,0.8)' }}>
                      Total Records: {profileStats.totalCount}
                    </div>
                    
                    {['Pre-Puff', 'Puff', 'Post-Puff'].map(phase => {
                      const phaseData = profileStats.phases[phase];
                      if (!phaseData || phaseData.count === 0) return null;
                      
                      return (
                        <div key={phase} style={styles.phaseSection}>
                          <div style={styles.phaseTitle}>{phase} ({phaseData.count} records)</div>
                          
                          {/* BME Heater Resistance */}
                          <div style={styles.sensorStats}>
                            <div style={styles.sensorStat}>
                              <div style={styles.sensorStatValue}>
                                {phaseData.sensors.BME_HeaterRes?.min?.toLocaleString()}
                              </div>
                              <div>BME Min</div>
                            </div>
                            <div style={styles.sensorStat}>
                              <div style={styles.sensorStatValue}>
                                {phaseData.sensors.BME_HeaterRes?.max?.toLocaleString()}
                              </div>
                              <div>BME Max</div>
                            </div>
                            <div style={styles.sensorStat}>
                              <div style={styles.sensorStatValue}>
                                {phaseData.sensors.BME_HeaterRes?.avg?.toFixed(0)}
                              </div>
                              <div>BME Avg</div>
                            </div>
                          </div>

                          {/* MQ Sensors */}
                          <div style={styles.sensorStats}>
                            <div style={styles.sensorStat}>
                              <div style={styles.sensorStatValue}>
                                {phaseData.sensors.MQ136_RAW?.avg?.toFixed(2)}
                              </div>
                              <div>MQ136 Avg</div>
                            </div>
                            <div style={styles.sensorStat}>
                              <div style={styles.sensorStatValue}>
                                {phaseData.sensors.MQ138_RAW?.avg?.toFixed(2)}
                              </div>
                              <div>MQ138 Avg</div>
                            </div>
                          </div>

                          {/* Additional Sensors */}
                          <div style={styles.sensorStats}>
                            <div style={styles.sensorStat}>
                              <div style={styles.sensorStatValue}>
                                {phaseData.sensors.Alpha_PID?.avg?.toFixed(2)}
                              </div>
                              <div>Alpha PID</div>
                            </div>
                            <div style={styles.sensorStat}>
                              <div style={styles.sensorStatValue}>
                                {phaseData.sensors.SPEC?.avg?.toFixed(0)}
                              </div>
                              <div>SPEC</div>
                            </div>
                            <div style={styles.sensorStat}>
                              <div style={styles.sensorStatValue}>
                                {phaseData.sensors.SGP40_VOC?.avg?.toFixed(0)}
                              </div>
                              <div>SGP40</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phase Analysis Tab */}
        <div style={activeTab === 'phases' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>⏱️ Overall Phase Analysis</h2>
            <div style={styles.statsGrid}>
              {Object.entries(stats.phases || {}).map(([phase, phaseStats]) => (
                <div key={phase} style={styles.statItem}>
                  <div style={styles.statValue}>{phaseStats.count}</div>
                  <div style={styles.statLabel}>{phase} Records</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '5px', color: 'rgba(255,255,255,0.7)' }}>
                    BME Avg: {phaseStats.sensors?.BME_HeaterRes?.avg?.toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts & Graphs Tab */}
        <div style={activeTab === 'charts' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📈 Advanced Analytics & Visualizations</h2>
            
            {/* Bell Curves */}
            <div style={styles.chartContainer}>
              <h3 style={{ color: '#fff', marginBottom: '15px' }}>🔔 Bell Curve Distributions</h3>
              <div style={styles.chartGrid}>
                {bmeBellCurve && (
                  <Plot
                    data={[
                      {
                        x: bmeBellCurve.x,
                        y: bmeBellCurve.y,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Theoretical Normal',
                        line: { color: '#4fc3f7', width: 3 },
                        fill: 'tonexty',
                        fillcolor: 'rgba(79, 195, 247, 0.3)'
                      },
                      {
                        x: bmeBellCurve.actualValues,
                        type: 'histogram',
                        name: 'Actual Data',
                        opacity: 0.7,
                        marker: { color: '#ff6b6b' },
                        nbinsx: 30
                      }
                    ]}
                    layout={{
                      title: 'BME Heater Resistance Distribution',
                      paper_bgcolor: 'rgba(0,0,0,0)',
                      plot_bgcolor: 'rgba(0,0,0,0)',
                      font: { color: '#fff' },
                      xaxis: { title: 'BME Heater Resistance', gridcolor: 'rgba(255,255,255,0.1)' },
                      yaxis: { title: 'Frequency', gridcolor: 'rgba(255,255,255,0.1)' },
                      showlegend: true,
                      legend: { font: { color: '#fff' } }
                    }}
                    style={{ width: '100%', height: '400px' }}
                    config={{ displayModeBar: false }}
                  />
                )}
                
                {mq136BellCurve && (
                  <Plot
                    data={[
                      {
                        x: mq136BellCurve.x,
                        y: mq136BellCurve.y,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Theoretical Normal',
                        line: { color: '#4fc3f7', width: 3 },
                        fill: 'tonexty',
                        fillcolor: 'rgba(79, 195, 247, 0.3)'
                      },
                      {
                        x: mq136BellCurve.actualValues,
                        type: 'histogram',
                        name: 'Actual Data',
                        opacity: 0.7,
                        marker: { color: '#ff6b6b' },
                        nbinsx: 30
                      }
                    ]}
                    layout={{
                      title: 'MQ136 Sensor Distribution',
                      paper_bgcolor: 'rgba(0,0,0,0)',
                      plot_bgcolor: 'rgba(0,0,0,0)',
                      font: { color: '#fff' },
                      xaxis: { title: 'MQ136 Raw Value', gridcolor: 'rgba(255,255,255,0.1)' },
                      yaxis: { title: 'Frequency', gridcolor: 'rgba(255,255,255,0.1)' },
                      showlegend: true,
                      legend: { font: { color: '#fff' } }
                    }}
                    style={{ width: '100%', height: '400px' }}
                    config={{ displayModeBar: false }}
                  />
                )}
              </div>
            </div>

            {/* Box Plots */}
            <div style={styles.chartContainer}>
              <h3 style={{ color: '#fff', marginBottom: '15px' }}>📦 Box Plots by Phase</h3>
              <Plot
                data={[
                  {
                    y: data.filter(row => row.Phase === 'Pre-Puff').map(row => parseFloat(row.BME_HeaterRes || 0)).filter(v => !isNaN(v)),
                    type: 'box',
                    name: 'Pre-Puff',
                    marker: { color: '#4fc3f7' }
                  },
                  {
                    y: data.filter(row => row.Phase === 'Puff').map(row => parseFloat(row.BME_HeaterRes || 0)).filter(v => !isNaN(v)),
                    type: 'box',
                    name: 'Puff',
                    marker: { color: '#ff6b6b' }
                  },
                  {
                    y: data.filter(row => row.Phase === 'Post-Puff').map(row => parseFloat(row.BME_HeaterRes || 0)).filter(v => !isNaN(v)),
                    type: 'box',
                    name: 'Post-Puff',
                    marker: { color: '#4caf50' }
                  }
                ]}
                layout={{
                  title: 'BME Heater Resistance by Phase',
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: '#fff' },
                  yaxis: { title: 'BME Heater Resistance', gridcolor: 'rgba(255,255,255,0.1)' },
                  showlegend: true,
                  legend: { font: { color: '#fff' } }
                }}
                style={{ width: '100%', height: '400px' }}
                config={{ displayModeBar: false }}
              />
            </div>

            {/* Correlation Matrix */}
            <div style={styles.chartContainer}>
              <h3 style={{ color: '#fff', marginBottom: '15px' }}>🔗 Sensor Correlation Matrix</h3>
              <Plot
                data={[
                  {
                    z: correlationData.z,
                    x: correlationData.x,
                    y: correlationData.y,
                    type: 'heatmap',
                    colorscale: 'RdBu',
                    zmid: 0
                  }
                ]}
                layout={{
                  title: 'Sensor Correlation Matrix',
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: '#fff' },
                  xaxis: { title: 'Sensors', gridcolor: 'rgba(255,255,255,0.1)' },
                  yaxis: { title: 'Sensors', gridcolor: 'rgba(255,255,255,0.1)' }
                }}
                style={{ width: '100%', height: '400px' }}
                config={{ displayModeBar: false }}
              />
            </div>

            {/* Time Series */}
            <div style={styles.chartContainer}>
              <h3 style={{ color: '#fff', marginBottom: '15px' }}>⏰ Time Series Analysis</h3>
              <Plot
                data={[
                  {
                    x: Array.from({ length: data.length }, (_, i) => i),
                    y: data.map(row => parseFloat(row.BME_HeaterRes || 0)),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'BME Heater Resistance',
                    line: { color: '#4fc3f7', width: 2 }
                  },
                  {
                    x: Array.from({ length: data.length }, (_, i) => i),
                    y: data.map(row => parseFloat(row.MQ136_RAW || 0)),
                    type: 'scatter',
                    mode: 'lines',
                    name: 'MQ136 Raw',
                    line: { color: '#ff6b6b', width: 2 },
                    yaxis: 'y2'
                  }
                ]}
                layout={{
                  title: 'Sensor Readings Over Time',
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: '#fff' },
                  xaxis: { title: 'Time Index', gridcolor: 'rgba(255,255,255,0.1)' },
                  yaxis: { title: 'BME Heater Resistance', gridcolor: 'rgba(255,255,255,0.1)' },
                  yaxis2: { title: 'MQ136 Raw', overlaying: 'y', side: 'right', gridcolor: 'rgba(255,255,255,0.1)' },
                  showlegend: true,
                  legend: { font: { color: '#fff' } }
                }}
                style={{ width: '100%', height: '400px' }}
                config={{ displayModeBar: false }}
              />
            </div>
          </div>
        </div>

        {/* CSV Viewer Tab */}
        <div style={activeTab === 'csv' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📊 CSV Data Viewer</h2>
            <div style={styles.csvViewer}>
              <table style={styles.csvTable}>
                <thead>
                  <tr>
                    {Object.keys(data[0] || {}).map((header, index) => (
                      <th key={index} style={styles.csvHeader}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 50).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex} style={styles.csvCell}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 50 && (
                <p style={{ textAlign: 'center', marginTop: '10px', color: 'rgba(255,255,255,0.7)' }}>
                  Showing first 50 rows of {data.length} total rows
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 