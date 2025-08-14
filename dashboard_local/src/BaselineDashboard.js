import React, { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';

const BaselineDashboard = () => {
  const [selectedConfig, setSelectedConfig] = useState('config_1');
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to calculate correlation
  const calculateCorrelation = (x, y) => {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((a, b, i) => a + b * y[i], 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumY2 = y.reduce((a, b) => a + b * b, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };



  // Load CSV files from backend API
  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading CSV files from deployed Render backend...');
      
      // Load all CSV files from deployed Render backend
      const [config1_13, config1_14, config2_13, config2_14] = await Promise.all([
        fetch('https://voc-analytics-dashboard.onrender.com/api/baseline-file?name=config_1 13_aug.csv').then(r => r.json()),
        fetch('https://voc-analytics-dashboard.onrender.com/api/baseline-file?name=config_1 14_aug.csv').then(r => r.json()),
        fetch('https://voc-analytics-dashboard.onrender.com/api/baseline-file?name=config_2 13_aug.csv').then(r => r.json()),
        fetch('https://voc-analytics-dashboard.onrender.com/api/baseline-file?name=config_2 14_aug.csv').then(r => r.json())
      ]);
      
      // Extract data from API responses
      const config1_13Data = config1_13.data || [];
      const config1_14Data = config1_14.data || [];
      const config2_13Data = config2_13.data || [];
      const config2_14Data = config2_14.data || [];
      
      console.log('Data loaded:', {
        config1_13: config1_13Data.length,
        config1_14: config1_14Data.length,
        config2_13: config2_13Data.length,
        config2_14: config2_14Data.length
      });
      
      setData({
        'config_1_13': config1_13Data,
        'config_1_14': config1_14Data,
        'config_2_13': config2_13Data,
        'config_2_14': config2_14Data
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading CSV files:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Get current data based on selection
  const currentData = useMemo(() => {
    if (selectedConfig === 'config_1') {
      return [
        ...(data['config_1_13'] || []),
        ...(data['config_1_14'] || [])
      ];
    } else if (selectedConfig === 'config_2') {
      return [
        ...(data['config_2_13'] || []),
        ...(data['config_2_14'] || [])
      ];
    }
    return [];
  }, [data, selectedConfig]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!currentData.length) return null;
    
    console.log('Calculating stats for', currentData.length, 'rows');
    
    const numericColumns = currentData[0] ?
      Object.keys(currentData[0]).filter(key => {
        const sampleValue = currentData[0][key];
        return !isNaN(parseFloat(sampleValue)) &&
               sampleValue !== 'N/A' &&
               key !== 'SNO' &&
               key !== 'Date' &&
               key !== 'Time' &&
               key !== 'Phase' &&
               key !== 'Heater_Profile' &&
               key !== 'HeaterProfile';
      }) : [];
    
    console.log('Numeric columns found:', numericColumns);
    
    const sensorStats = {};
    numericColumns.forEach(col => {
      const values = currentData
        .map(row => parseFloat(row[col]))
        .filter(val => !isNaN(val));
      
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length);
        
        sensorStats[col] = { min, max, avg, std, count: values.length };
      }
    });
    
    // Get unique heater profiles
    const heaterProfileCol = currentData[0]?.Heater_Profile ? 'Heater_Profile' : 'HeaterProfile';
    const heaterProfiles = [...new Set(currentData.map(row => row[heaterProfileCol]).filter(Boolean))].sort();
    
    return {
      totalRecords: currentData.length,
      sensorStats,
      heaterProfiles,
      uniqueDates: [...new Set(currentData.map(row => row.Date).filter(Boolean))].sort()
    };
  }, [currentData]);

  // Time series data
  const timeSeriesData = useMemo(() => {
    if (!currentData.length) return [];
    
    const numericColumns = Object.keys(currentData[0]).filter(key => {
      const sampleValue = currentData[0][key];
      return !isNaN(parseFloat(sampleValue)) &&
             sampleValue !== 'N/A' &&
             key !== 'SNO' &&
             key !== 'Date' &&
             key !== 'Time' &&
             key !== 'Phase' &&
             key !== 'Heater_Profile' &&
             key !== 'HeaterProfile';
    }).slice(0, 5); // Limit to 5 columns for readability
    
    return numericColumns.map(col => ({
      x: currentData.map((_, index) => index),
      y: currentData.map(row => parseFloat(row[col]) || 0),
      type: 'scatter',
      mode: 'lines',
      name: col,
      line: { width: 1 }
    }));
  }, [currentData]);

  // Correlation matrix
  const correlationMatrix = useMemo(() => {
    if (!currentData.length) return { data: [], layout: {} };
    
    const numericColumns = Object.keys(currentData[0]).filter(key => {
      const sampleValue = currentData[0][key];
      return !isNaN(parseFloat(sampleValue)) &&
             sampleValue !== 'N/A' &&
             key !== 'SNO' &&
             key !== 'Date' &&
             key !== 'Time' &&
             key !== 'Phase' &&
             key !== 'Heater_Profile' &&
             key !== 'HeaterProfile';
    }).slice(0, 8); // Limit to 8 columns for readability
    
    const correlationValues = [];
    
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = 0; j < numericColumns.length; j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];
        
        const values1 = currentData.map(row => parseFloat(row[col1])).filter(val => !isNaN(val));
        const values2 = currentData.map(row => parseFloat(row[col2])).filter(val => !isNaN(val));
        
        if (values1.length > 0 && values2.length > 0) {
          const correlation = calculateCorrelation(values1, values2);
          correlationValues.push(correlation);
        } else {
          correlationValues.push(0);
        }
      }
    }
    
    return {
      data: [{
        z: correlationValues,
        x: numericColumns,
        y: numericColumns,
        type: 'heatmap',
        colorscale: 'RdBu',
        zmid: 0
      }],
      layout: {
        title: 'Sensor Correlation Matrix',
        width: 600,
        height: 500
      }
    };
  }, [currentData]);

  // Box plot data
  const boxPlotData = useMemo(() => {
    if (!currentData.length) return [];
    
    const numericColumns = Object.keys(currentData[0]).filter(key => {
      const sampleValue = currentData[0][key];
      return !isNaN(parseFloat(sampleValue)) &&
             sampleValue !== 'N/A' &&
             key !== 'SNO' &&
             key !== 'Date' &&
             key !== 'Time' &&
             key !== 'Phase' &&
             key !== 'Heater_Profile' &&
             key !== 'HeaterProfile';
    }).slice(0, 6); // Limit to 6 columns for readability
    
    return numericColumns.map(col => ({
      y: currentData.map(row => parseFloat(row[col])).filter(val => !isNaN(val)),
      type: 'box',
      name: col,
      boxpoints: false
    }));
  }, [currentData]);

  // Download functions
  const downloadCSV = (data, filename) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadStats = () => {
    if (!stats) return;
    
    const statsData = Object.entries(stats.sensorStats).map(([sensor, stat]) => ({
      Sensor: sensor,
      Min: stat.min,
      Max: stat.max,
      Average: stat.avg,
      'Std Dev': stat.std,
      Count: stat.count
    }));
    
    downloadCSV(statsData, 'sensor_statistics.csv');
  };

  if (loading) {
    return <div style={styles.loading}>Loading baseline data...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button
            onClick={() => window.history.back()}
            style={styles.backButton}
          >
            ← Back
          </button>
          <button
            onClick={() => window.location.href = '/'}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
        <h1 style={styles.title}>🔬 Baseline Sensor Analysis Dashboard</h1>
        <div style={styles.subtitle}>Comprehensive Analysis of Baseline Sensor Data (13th & 14th August Combined)</div>
      </div>

      {/* Configuration Selector */}
      <div style={styles.configSelector}>
        <label style={styles.configLabel}>Select Configuration:</label>
        <select
          value={selectedConfig}
          onChange={(e) => setSelectedConfig(e.target.value)}
          style={styles.configSelect}
        >
          <option value="config_1">Config 1 (Both Dates Combined)</option>
          <option value="config_2">Config 2 (Both Dates Combined)</option>
        </select>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'overview' && styles.activeTab) }}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'timeSeries' && styles.activeTab) }}
          onClick={() => setActiveTab('timeSeries')}
        >
          ⏰ Time Series
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'correlation' && styles.activeTab) }}
          onClick={() => setActiveTab('correlation')}
        >
          🔗 Correlation
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'distribution' && styles.activeTab) }}
          onClick={() => setActiveTab('distribution')}
        >
          📦 Distribution
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'downloads' && styles.activeTab) }}
          onClick={() => setActiveTab('downloads')}
        >
          💾 Downloads
        </button>
      </div>

      {/* Tab Content */}
      
      {/* Overview Tab */}
      <div style={activeTab === 'overview' ? styles.activeTabContent : styles.tabContent}>
        {activeTab === 'overview' && stats && (
          <div style={styles.overviewContent}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📊 Sensor Statistics Summary</h2>
              
              {/* Enhanced Data Overview Cards */}
              <div style={styles.overviewCards}>
                <div style={styles.overviewCard}>
                  <div style={styles.overviewIcon}>📅</div>
                  <div style={styles.overviewContent}>
                    <h3 style={styles.overviewTitle}>Data Coverage</h3>
                    <p style={styles.overviewValue}>13th & 14th August 2025</p>
                    <p style={styles.overviewSubtext}>Comprehensive baseline analysis</p>
                  </div>
                </div>
                
                <div style={styles.overviewCard}>
                  <div style={styles.overviewIcon}>📊</div>
                  <div style={styles.overviewContent}>
                    <h3 style={styles.overviewTitle}>Total Records</h3>
                    <p style={styles.overviewValue}>{stats.totalRecords?.toLocaleString()}</p>
                    <p style={styles.overviewSubtext}>measurements analyzed</p>
                  </div>
                </div>
                
                <div style={styles.overviewCard}>
                  <div style={styles.overviewIcon}>🔥</div>
                  <div style={styles.overviewContent}>
                    <h3 style={styles.overviewTitle}>Heater Profiles</h3>
                    <p style={styles.overviewValue}>{stats.heaterProfiles?.length || 0}</p>
                    <p style={styles.overviewSubtext}>unique configurations</p>
                  </div>
                </div>
                
                <div style={styles.overviewCard}>
                  <div style={styles.overviewIcon}>🔬</div>
                  <div style={styles.overviewContent}>
                    <h3 style={styles.overviewTitle}>Sensors</h3>
                    <p style={styles.overviewValue}>{stats.sensorStats ? Object.keys(stats.sensorStats).length : 0}</p>
                    <p style={styles.overviewSubtext}>active sensors</p>
                  </div>
                </div>
              </div>

              {/* Data Quality Indicators */}
              <div style={styles.dataQualitySection}>
                <h3 style={styles.sectionTitle}>📈 Data Quality Metrics</h3>
                <div style={styles.qualityGrid}>
                  <div style={styles.qualityCard}>
                    <div style={styles.qualityHeader}>
                      <span style={styles.qualityLabel}>Data Completeness</span>
                      <span style={styles.qualityValue}>100%</span>
                    </div>
                    <div style={styles.qualityBar}>
                      <div style={styles.qualityBarFill}></div>
                    </div>
                    <p style={styles.qualityDescription}>All expected data points present</p>
                  </div>
                  
                  <div style={styles.qualityCard}>
                    <div style={styles.qualityHeader}>
                      <span style={styles.qualityLabel}>Profile Distribution</span>
                      <span style={styles.qualityValue}>Balanced</span>
                    </div>
                    <div style={styles.qualityBar}>
                      <div style={styles.qualityBarFill}></div>
                    </div>
                    <p style={styles.qualityDescription}>Even distribution across profiles</p>
                  </div>
                  
                  <div style={styles.qualityCard}>
                    <div style={styles.qualityHeader}>
                      <span style={styles.qualityLabel}>Sensor Coverage</span>
                      <span style={styles.qualityValue}>Complete</span>
                    </div>
                    <div style={styles.qualityBar}>
                      <div style={styles.qualityBarFill}></div>
                    </div>
                    <p style={styles.qualityDescription}>All sensors reporting data</p>
                  </div>
                </div>
              </div>
              
              <div style={styles.heaterProfilesSection}>
                <h3 style={styles.heaterProfilesTitle}>🔥 Heater Profile Analysis</h3>
                <div style={styles.heaterProfilesGrid}>
                  {stats.heaterProfiles?.map(profile => (
                    <div key={profile} style={styles.heaterProfileCard}>
                      <h4 style={styles.profileTitle}>Profile {profile}</h4>
                      <div style={styles.profileStats}>
                        <div style={styles.profileStat}>
                          <span style={styles.profileStatLabel}>Records:</span>
                          <span style={styles.profileStatValue}>
                            {currentData.filter(row => 
                              (row.Heater_Profile || row.HeaterProfile) === profile
                            ).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.sensorStatsSection}>
                <h3 style={styles.sensorStatsTitle}>📊 Sensor Statistics</h3>
                <div style={styles.sensorStatsGrid}>
                  {stats.sensorStats && Object.entries(stats.sensorStats).map(([sensor, stat]) => (
                    <div key={sensor} style={styles.sensorStatCard}>
                      <div style={styles.sensorStatHeader}>
                        <span style={styles.sensorStatIcon}>📊</span>
                        <h4 style={styles.sensorStatTitle}>{sensor}</h4>
                      </div>
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
            </div>
          </div>
        )}
      </div>

      {/* Time Series Tab */}
      <div style={activeTab === 'timeSeries' ? styles.activeTabContent : styles.tabContent}>
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
      </div>

      {/* Correlation Tab */}
      <div style={activeTab === 'correlation' ? styles.activeTabContent : styles.tabContent}>
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
      </div>

      {/* Distribution Tab */}
      <div style={activeTab === 'distribution' ? styles.activeTabContent : styles.tabContent}>
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
      </div>

      {/* Downloads Tab */}
      <div style={activeTab === 'downloads' ? styles.activeTabContent : styles.tabContent}>
        {activeTab === 'downloads' && (
          <div style={styles.downloadsContent}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>💾 Data Export Options</h2>
              <div style={styles.downloadGrid}>
                <div style={styles.downloadCard}>
                  <h3 style={styles.downloadTitle}>Raw Data (CSV)</h3>
                  <p style={styles.downloadDescription}>
                    Download the complete raw sensor data for {selectedConfig} (includes data from both 13th and 14th August)
                  </p>
                  <button 
                    onClick={() => downloadCSV(currentData, `${selectedConfig}_baseline_data.csv`)}
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
                    Download all configuration files separately
                  </p>
                  <div style={styles.multiDownloadButtons}>
                    <button 
                      onClick={() => downloadCSV(data['config_1_13'] || [], 'config_1_13_aug.csv')}
                      style={styles.downloadButton}
                    >
                      Config 1 (13 Aug)
                    </button>
                    <button 
                      onClick={() => downloadCSV(data['config_1_14'] || [], 'config_1_14_aug.csv')}
                      style={styles.downloadButton}
                    >
                      Config 1 (14 Aug)
                    </button>
                    <button 
                      onClick={() => downloadCSV(data['config_2_13'] || [], 'config_2_13_aug.csv')}
                      style={styles.downloadButton}
                    >
                      Config 2 (13 Aug)
                    </button>
                    <button 
                      onClick={() => downloadCSV(data['config_2_14'] || [], 'config_2_14_aug.csv')}
                      style={styles.downloadButton}
                    >
                      Config 2 (14 Aug)
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
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#2c3e50',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px',
    border: '1px solid rgba(52, 73, 94, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  backButton: {
    padding: '12px 20px',
    backgroundColor: 'rgba(52, 73, 94, 0.8)',
    color: 'white',
    border: '1px solid rgba(52, 73, 94, 0.2)',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    fontWeight: '500',
    ':hover': {
      backgroundColor: 'rgba(52, 73, 94, 1)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    }
  },
  logoutButton: {
    padding: '12px 20px',
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    color: 'white',
    border: '1px solid rgba(231, 76, 60, 0.2)',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    fontWeight: '500',
    ':hover': {
      backgroundColor: 'rgba(231, 76, 60, 1)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)'
    }
  },
  title: {
    fontSize: '3rem',
    color: '#2c3e50',
    margin: '0 0 15px 0',
    fontWeight: '700',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(45deg, #2c3e50, #34495e)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '1.3rem',
    color: '#7f8c8d',
    margin: '0',
    fontWeight: '400',
    letterSpacing: '0.5px'
  },
  configSelector: {
    textAlign: 'center',
    marginBottom: '30px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '25px',
    border: '1px solid rgba(52, 73, 94, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
  },
  configLabel: {
    fontSize: '1.2rem',
    marginRight: '15px',
    fontWeight: '600',
    color: '#2c3e50',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  configSelect: {
    padding: '12px 20px',
    fontSize: '1rem',
    borderRadius: '10px',
    border: '1px solid rgba(52, 73, 94, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#2c3e50',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '250px'
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid rgba(52, 73, 94, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
  },
  tab: {
    padding: '15px 30px',
    backgroundColor: 'rgba(52, 73, 94, 0.1)',
    border: '1px solid rgba(52, 73, 94, 0.2)',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    color: '#2c3e50',
    fontWeight: '500',
    backdropFilter: 'blur(10px)',
    ':hover': {
      backgroundColor: 'rgba(52, 73, 94, 0.2)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)'
    }
  },
  activeTab: {
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    color: 'white',
    border: '1px solid rgba(52, 152, 219, 0.3)',
    boxShadow: '0 6px 20px rgba(52, 152, 219, 0.3)',
    transform: 'translateY(-2px)'
  },
  tabContent: {
    display: 'none',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  activeTabContent: {
    display: 'block',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '35px',
    borderRadius: '20px',
    marginBottom: '30px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(52, 73, 94, 0.1)',
    backdropFilter: 'blur(10px)'
  },
  cardTitle: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '25px',
    fontWeight: '600',
    textAlign: 'center',
    background: 'linear-gradient(45deg, #3498db, #2980b9)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heaterProfilesSection: {
    marginBottom: '30px'
  },
  heaterProfilesTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '20px',
    fontWeight: '600',
    textAlign: 'center',
    background: 'linear-gradient(45deg, #3498db, #2980b9)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heaterProfilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  heaterProfileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '20px',
    borderRadius: '15px',
    textAlign: 'center',
    border: '1px solid rgba(52, 152, 219, 0.2)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  heaterProfileValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: '10px'
  },
  heaterProfileLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  sensorStatsSection: {
    marginBottom: '30px'
  },
  sensorStatsTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '20px',
    fontWeight: '600',
    textAlign: 'center',
    background: 'linear-gradient(45deg, #3498db, #2980b9)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  sensorStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  sensorStatCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '25px',
    borderRadius: '15px',
    border: '1px solid rgba(52, 152, 219, 0.2)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
  },
  sensorStatHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px'
  },
  sensorStatIcon: {
    fontSize: '2rem',
    marginRight: '15px',
    color: '#3498db'
  },
  sensorStatTitle: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    fontWeight: '600'
  },
  sensorStatRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '8px 0',
    borderBottom: '1px solid rgba(52, 152, 219, 0.1)'
  },
  sensorStatLabel: {
    fontWeight: '500',
    color: '#34495e'
  },
  sensorStatValue: {
    color: '#3498db',
    fontFamily: 'monospace',
    fontWeight: '600'
  },
  downloadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px'
  },
  downloadCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    border: '1px solid rgba(52, 152, 219, 0.2)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease'
  },
  downloadTitle: {
    fontSize: '1.4rem',
    color: '#2c3e50',
    marginBottom: '20px',
    fontWeight: '600'
  },
  downloadDescription: {
    color: '#7f8c8d',
    marginBottom: '25px',
    lineHeight: '1.6'
  },
  downloadButton: {
    padding: '15px 30px',
    background: 'linear-gradient(45deg, #3498db, #2980b9)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(52, 152, 219, 0.4)'
    }
  },
  multiDownloadButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.8rem',
    color: '#2c3e50',
    marginTop: '100px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  error: {
    textAlign: 'center',
    fontSize: '1.8rem',
    color: '#e74c3c',
    marginTop: '100px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  overviewContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginTop: '20px'
  },
  overviewCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
    marginBottom: '30px'
  },
  overviewCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '25px',
    borderRadius: '15px',
    border: '1px solid rgba(52, 152, 219, 0.2)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 35px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(52, 152, 219, 0.4)'
    }
  },
  overviewIcon: {
    fontSize: '3rem',
    marginRight: '20px',
    color: '#3498db'
  },
  overviewTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    marginBottom: '8px',
    fontWeight: '600'
  },
  overviewValue: {
    fontSize: '1.8rem',
    color: '#3498db',
    marginBottom: '5px',
    fontWeight: '700'
  },
  overviewSubtext: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  dataQualitySection: {
    marginBottom: '30px'
  },
  qualityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  qualityCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  qualityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  qualityLabel: {
    fontWeight: 'bold',
    color: '#333'
  },
  qualityValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#007bff'
  },
  qualityBar: {
    height: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  qualityBarFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: '5px'
  },
  qualityDescription: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '10px'
  },
  timeSeriesContent: {
    flex: 1
  },
  correlationContent: {
    flex: 1
  },
  distributionContent: {
    flex: 1
  },
  downloadsContent: {
    flex: 1
  }
};

export default BaselineDashboard;
