import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { useNavigate } from 'react-router-dom';

const BaselineDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState('config1');

  // Fetch baseline data
  useEffect(() => {
    const fetchBaselineData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/baseline-files`);
        if (!response.ok) {
          throw new Error('Failed to fetch baseline files');
        }
        
        // Fetch both config files
        const config1Response = await fetch(`/api/baseline-file?filename=${encodeURIComponent('config_1 13_aug.csv')}`);
        const config2Response = await fetch(`/api/baseline-file?filename=${encodeURIComponent('config_2 13_aug.csv')}`);
        
        if (!config1Response.ok || !config2Response.ok) {
          throw new Error('Failed to fetch config files');
        }
        
        const config1Data = await config1Response.json();
        const config2Data = await config2Response.json();
        
        setData({
          config1: config1Data,
          config2: config2Data
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBaselineData();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data) return {};
    
    const currentData = data[selectedConfig];
    if (!currentData || currentData.length === 0) return {};

    const numericColumns = currentData[0] ? 
      Object.keys(currentData[0]).filter(key => 
        key !== 'SNO' && key !== 'Date' && key !== 'Time' && key !== 'Phase' && 
        key !== 'Heater_Profile' && key !== 'HeaterProfile' && key !== 'VOC' && 
        key !== 'Concentration' && key !== 'Distance'
      ) : [];

    const stats = {};
    numericColumns.forEach(col => {
      const values = currentData.map(row => parseFloat(row[col] || 0)).filter(v => !isNaN(v));
      if (values.length > 0) {
        stats[col] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((sum, val) => sum + val, 0) / values.length,
          std: Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - (values.reduce((sum, val) => sum + val, 0) / values.length), 2), 0) / values.length),
          count: values.length
        };
      }
    });

    // Get unique heater profiles
    const heaterProfiles = [...new Set(currentData.map(row => row.Heater_Profile || row.HeaterProfile))];
    
    return {
      totalRecords: currentData.length,
      uniqueHeaterProfiles: heaterProfiles.length,
      heaterProfiles: heaterProfiles,
      sensorStats: stats,
      dateRange: {
        start: currentData[0]?.Date,
        end: currentData[currentData.length - 1]?.Date
      }
    };
  }, [data, selectedConfig]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Download data functions
  const downloadCSV = useCallback((configData, filename) => {
    if (!configData || configData.length === 0) return;
    
    const headers = Object.keys(configData[0]);
    const csvContent = [
      headers.join(','),
      ...configData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const downloadStats = useCallback(() => {
    if (!stats.sensorStats) return;
    
    const statsContent = [
      'Sensor,Min,Max,Average,Standard Deviation,Count',
      ...Object.entries(stats.sensorStats).map(([sensor, stat]) => 
        `${sensor},${stat.min.toFixed(4)},${stat.max.toFixed(4)},${stat.avg.toFixed(4)},${stat.std.toFixed(4)},${stat.count}`
      )
    ].join('\n');
    
    const blob = new Blob([statsContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `baseline_stats_${selectedConfig}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [stats, selectedConfig]);

  // Create time series data
  const timeSeriesData = useMemo(() => {
    if (!data || !data[selectedConfig]) return [];
    
    const currentData = data[selectedConfig];
    const numericColumns = Object.keys(currentData[0] || {}).filter(key => 
      key !== 'SNO' && key !== 'Date' && key !== 'Time' && key !== 'Phase' && 
      key !== 'Heater_Profile' && key !== 'HeaterProfile' && key !== 'VOC' && 
      key !== 'Concentration' && key !== 'Distance'
    );

    return numericColumns.map(col => ({
      x: currentData.map((row, index) => index),
      y: currentData.map(row => parseFloat(row[col] || 0)),
      type: 'scatter',
      mode: 'lines',
      name: col,
      line: { width: 2 }
    }));
  }, [data, selectedConfig]);

  // Create correlation matrix
  const correlationMatrix = useMemo(() => {
    if (!data || !data[selectedConfig]) return { data: [], layout: {} };
    
    const currentData = data[selectedConfig];
    const numericColumns = Object.keys(currentData[0] || {}).filter(key => 
      key !== 'SNO' && key !== 'Date' && key !== 'Time' && key !== 'Phase' && 
      key !== 'Heater_Profile' && key !== 'HeaterProfile' && key !== 'VOC' && 
      key !== 'Concentration' && key !== 'Distance'
    );

    if (numericColumns.length === 0) return { data: [], layout: {} };

    const correlationData = [];
    for (let i = 0; i < numericColumns.length; i++) {
      const row = [];
      for (let j = 0; j < numericColumns.length; j++) {
        if (i === j) {
          row.push(1);
        } else {
          const values1 = currentData.map(row => parseFloat(row[numericColumns[i]] || 0)).filter(v => !isNaN(v));
          const values2 = currentData.map(row => parseFloat(row[numericColumns[j]] || 0)).filter(v => !isNaN(v));
          
          if (values1.length > 0 && values2.length > 0) {
            const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
            const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;
            
            const numerator = values1.reduce((sum, val, idx) => sum + (val - mean1) * (values2[idx] - mean2), 0);
            const denominator = Math.sqrt(
              values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
              values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
            );
            
            row.push(denominator === 0 ? 0 : numerator / denominator);
          } else {
            row.push(0);
          }
        }
      }
      correlationData.push(row);
    }

    return {
      data: [{
        z: correlationData,
        x: numericColumns,
        y: numericColumns,
        type: 'heatmap',
        colorscale: 'RdBu',
        zmid: 0
      }],
      layout: {
        title: `Correlation Matrix - ${selectedConfig.toUpperCase()}`,
        xaxis: { title: 'Sensors' },
        yaxis: { title: 'Sensors' },
        width: 600,
        height: 500
      }
    };
  }, [data, selectedConfig]);

  // Create box plots
  const boxPlotData = useMemo(() => {
    if (!data || !data[selectedConfig]) return [];
    
    const currentData = data[selectedConfig];
    const numericColumns = Object.keys(currentData[0] || {}).filter(key => 
      key !== 'SNO' && key !== 'Date' && key !== 'Time' && key !== 'Phase' && 
      key !== 'Heater_Profile' && key !== 'HeaterProfile' && key !== 'VOC' && 
      key !== 'Concentration' && key !== 'Distance'
    );

    return numericColumns.map(col => ({
      y: currentData.map(row => parseFloat(row[col] || 0)).filter(v => !isNaN(v)),
      type: 'box',
      name: col,
      boxpoints: 'outliers'
    }));
  }, [data, selectedConfig]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading Baseline Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Error: {error}</div>
        <button onClick={() => navigate('/options')} style={styles.backButton}>
          Back to Options
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/options')} style={styles.backButton}>
          ← Back to Options
        </button>
        <h1 style={styles.title}>📈 Baseline Values Dashboard</h1>
        <div style={styles.subtitle}>Scientific Analysis of Baseline Sensor Data</div>
      </div>

      {/* Configuration Selector */}
      <div style={styles.configSelector}>
        <label style={styles.configLabel}>Select Configuration:</label>
        <select 
          value={selectedConfig} 
          onChange={(e) => setSelectedConfig(e.target.value)}
          style={styles.configSelect}
        >
          <option value="config1">Config 1 (Comprehensive Sensors)</option>
          <option value="config2">Config 2 (BME Focused)</option>
        </select>
      </div>

      {/* Overview Statistics */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.totalRecords?.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Records</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.uniqueHeaterProfiles}</div>
          <div style={styles.statLabel}>Heater Profiles</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.dateRange?.start}</div>
          <div style={styles.statLabel}>Start Date</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.dateRange?.end}</div>
          <div style={styles.statLabel}>End Date</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        <button
          style={activeTab === 'overview' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => handleTabChange('overview')}
        >
          📊 Overview
        </button>
        <button
          style={activeTab === 'timeSeries' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => handleTabChange('timeSeries')}
        >
          ⏰ Time Series
        </button>
        <button
          style={activeTab === 'correlation' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => handleTabChange('correlation')}
        >
          🔗 Correlation
        </button>
        <button
          style={activeTab === 'distribution' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => handleTabChange('distribution')}
        >
          📦 Distribution
        </button>
        <button
          style={activeTab === 'downloads' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => handleTabChange('downloads')}
        >
          💾 Downloads
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={styles.overviewContent}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📊 Sensor Statistics Summary</h2>
              <div style={styles.sensorStatsGrid}>
                {stats.sensorStats && Object.entries(stats.sensorStats).map(([sensor, stat]) => (
                  <div key={sensor} style={styles.sensorCard}>
                    <h3 style={styles.sensorTitle}>{sensor}</h3>
                    <div style={styles.sensorStatRow}>
                      <span style={styles.sensorStatLabel}>Min:</span>
                      <span style={styles.sensorStatValue}>{stat.min.toFixed(4)}</span>
                    </div>
                    <div style={styles.sensorStatRow}>
                      <span style={styles.sensorStatLabel}>Max:</span>
                      <span style={styles.sensorStatValue}>{stat.max.toFixed(4)}</span>
                    </div>
                    <div style={styles.sensorStatRow}>
                      <span style={styles.sensorStatLabel}>Avg:</span>
                      <span style={styles.sensorStatValue}>{stat.avg.toFixed(4)}</span>
                    </div>
                    <div style={styles.sensorStatRow}>
                      <span style={styles.sensorStatLabel}>Std Dev:</span>
                      <span style={styles.sensorStatValue}>{stat.std.toFixed(4)}</span>
                    </div>
                    <div style={styles.sensorStatRow}>
                      <span style={styles.sensorStatLabel}>Count:</span>
                      <span style={styles.sensorStatValue}>{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>🔥 Heater Profile Analysis</h2>
              <div style={styles.heaterProfilesGrid}>
                {stats.heaterProfiles?.map(profile => (
                  <div key={profile} style={styles.profileCard}>
                    <h3 style={styles.profileTitle}>Profile {profile}</h3>
                    <div style={styles.profileStats}>
                      <div style={styles.profileStat}>
                        <span style={styles.profileStatLabel}>Records:</span>
                        <span style={styles.profileStatValue}>
                          {data[selectedConfig].filter(row => 
                            (row.Heater_Profile || row.HeaterProfile) === profile
                          ).length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Time Series Tab */}
        {activeTab === 'timeSeries' && (
          <div style={styles.timeSeriesContent}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>⏰ Sensor Time Series Analysis</h2>
              <Plot
                data={timeSeriesData}
                layout={{
                  title: `Time Series - ${selectedConfig.toUpperCase()}`,
                  xaxis: { title: 'Sample Index' },
                  yaxis: { title: 'Sensor Values' },
                  width: 800,
                  height: 500,
                  showlegend: true
                }}
                config={{ displayModeBar: true, displaylogo: false }}
              />
            </div>
          </div>
        )}

        {/* Correlation Tab */}
        {activeTab === 'correlation' && (
          <div style={styles.correlationContent}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>🔗 Sensor Correlation Analysis</h2>
              <Plot
                data={correlationMatrix.data}
                layout={correlationMatrix.layout}
                config={{ displayModeBar: true, displaylogo: false }}
              />
            </div>
          </div>
        )}

        {/* Distribution Tab */}
        {activeTab === 'distribution' && (
          <div style={styles.distributionContent}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📦 Sensor Distribution Analysis</h2>
              <Plot
                data={boxPlotData}
                layout={{
                  title: `Box Plot Distribution - ${selectedConfig.toUpperCase()}`,
                  xaxis: { title: 'Sensors' },
                  yaxis: { title: 'Values' },
                  width: 800,
                  height: 500,
                  showlegend: false
                }}
                config={{ displayModeBar: true, displaylogo: false }}
              />
            </div>
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div style={styles.downloadsContent}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>💾 Data Export Options</h2>
              <div style={styles.downloadGrid}>
                <div style={styles.downloadCard}>
                  <h3 style={styles.downloadTitle}>Raw Data (CSV)</h3>
                  <p style={styles.downloadDescription}>
                    Download the complete raw sensor data for {selectedConfig}
                  </p>
                  <button 
                    onClick={() => downloadCSV(data[selectedConfig], `${selectedConfig}_baseline_data.csv`)}
                    style={styles.downloadButton}
                  >
                    Download CSV
                  </button>
                </div>
                
                <div style={styles.downloadCard}>
                  <h3 style={styles.downloadTitle}>Statistics Summary (CSV)</h3>
                  <p style={styles.downloadDescription}>
                    Download calculated statistics for all sensors
                  </p>
                  <button 
                    onClick={downloadStats}
                    style={styles.downloadButton}
                  >
                    Download Stats
                  </button>
                </div>
                
                <div style={styles.downloadCard}>
                  <h3 style={styles.downloadTitle}>All Configurations</h3>
                  <p style={styles.downloadDescription}>
                    Download both configuration files
                  </p>
                  <div style={styles.multiDownloadButtons}>
                    <button 
                      onClick={() => downloadCSV(data.config1, 'config_1_baseline_data.csv')}
                      style={styles.downloadButton}
                    >
                      Config 1
                    </button>
                    <button 
                      onClick={() => downloadCSV(data.config2, 'config_2_baseline_data.csv')}
                      style={styles.downloadButton}
                    >
                      Config 2
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    margin: '0'
  },
  configSelector: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  configLabel: {
    fontSize: '1.1rem',
    marginRight: '15px',
    fontWeight: 'bold'
  },
  configSelect: {
    padding: '8px 15px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ddd'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '1rem',
    color: '#666'
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  activeTab: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff'
  },
  tabContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    marginBottom: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  cardTitle: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '25px',
    textAlign: 'center'
  },
  sensorStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  sensorCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e9ecef'
  },
  sensorTitle: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '15px',
    textAlign: 'center'
  },
  sensorStatRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    padding: '5px 0',
    borderBottom: '1px solid #eee'
  },
  sensorStatLabel: {
    fontWeight: 'bold',
    color: '#555'
  },
  sensorStatValue: {
    color: '#007bff',
    fontFamily: 'monospace'
  },
  heaterProfilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  profileCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #e9ecef'
  },
  profileTitle: {
    fontSize: '1.3rem',
    color: '#333',
    marginBottom: '15px'
  },
  profileStats: {
    textAlign: 'center'
  },
  profileStat: {
    marginBottom: '10px'
  },
  profileStatLabel: {
    fontWeight: 'bold',
    color: '#555',
    marginRight: '10px'
  },
  profileStatValue: {
    color: '#007bff',
    fontSize: '1.1rem'
  },
  downloadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px'
  },
  downloadCard: {
    backgroundColor: '#f8f9fa',
    padding: '25px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #e9ecef'
  },
  downloadTitle: {
    fontSize: '1.3rem',
    color: '#333',
    marginBottom: '15px'
  },
  downloadDescription: {
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  downloadButton: {
    padding: '12px 25px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s'
  },
  multiDownloadButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#666',
    marginTop: '100px'
  },
  error: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#dc3545',
    marginTop: '100px'
  }
};

export default BaselineDashboard;
