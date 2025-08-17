import React, { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';

const BaselineDashboard = () => {
  const [selectedConfig, setSelectedConfig] = useState('config_1');
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');

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
      line: { width: 2 }
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
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div style={styles.loadingText}>Loading baseline data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <div style={styles.errorText}>Error: {error}</div>
        <button onClick={loadData} style={styles.retryButton}>Retry</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button onClick={() => window.history.back()} style={styles.backButton}>
            ← Back
          </button>
          <div style={styles.headerCenter}>
            <h1 style={styles.title}>🔬 Baseline Sensor Analysis</h1>
            <p style={styles.subtitle}>Comprehensive Analysis Dashboard</p>
          </div>
          <div style={styles.headerActions}>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={styles.themeButton}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={() => window.location.href = '/'} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Configuration Selector */}
      <div style={styles.configSelector}>
        <div style={styles.configCard}>
          <label style={styles.configLabel}>Configuration:</label>
          <select
            value={selectedConfig}
            onChange={(e) => setSelectedConfig(e.target.value)}
            style={styles.configSelect}
          >
            <option value="config_1">Config 1 (13th & 14th August)</option>
            <option value="config_2">Config 2 (13th & 14th August)</option>
          </select>
        </div>
      </div>

      {/* Quick Stats Cards */}
      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.totalRecords?.toLocaleString()}</div>
              <div style={styles.statLabel}>Total Records</div>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔬</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.sensorStats ? Object.keys(stats.sensorStats).length : 0}</div>
              <div style={styles.statLabel}>Active Sensors</div>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔥</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.heaterProfiles?.length || 0}</div>
              <div style={styles.statLabel}>Heater Profiles</div>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{stats.uniqueDates?.length || 0}</div>
              <div style={styles.statLabel}>Data Days</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'timeSeries', label: '⏰ Time Series', icon: '⏰' },
          { id: 'correlation', label: '🔗 Correlation', icon: '🔗' },
          { id: 'distribution', label: '📦 Distribution', icon: '📦' },
          { id: 'downloads', label: '💾 Downloads', icon: '💾' }
        ].map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id && styles.activeTab)
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div style={styles.overviewContent}>
            {/* Sensor Statistics Grid */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>📊 Sensor Statistics</h2>
              <div style={styles.sensorStatsGrid}>
                {stats.sensorStats && Object.entries(stats.sensorStats).map(([sensor, stat]) => (
                  <div key={sensor} style={styles.sensorStatCard}>
                    <div style={styles.sensorStatHeader}>
                      <div style={styles.sensorStatIcon}>📊</div>
                      <h3 style={styles.sensorStatTitle}>{sensor}</h3>
                    </div>
                    <div style={styles.sensorStatMetrics}>
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
                  </div>
                ))}
              </div>
            </div>

                         {/* Heater Profiles Section */}
             <div style={styles.section}>
               <h2 style={styles.sectionTitle}>🔥 Heater Profile Analysis</h2>
               
               {/* Profile Analysis Overview */}
               <div style={styles.profileOverview}>
                 <div style={styles.overviewCard}>
                   <div style={styles.overviewIcon}>🌡️</div>
                   <div style={styles.overviewContent}>
                     <h3 style={styles.overviewTitle}>Temperature Control Strategy</h3>
                     <p style={styles.overviewText}>
                       Each profile uses unique temperature ramping patterns to optimize sensor performance 
                       and VOC detection sensitivity across different environmental conditions.
                     </p>
                   </div>
                 </div>
                 
                 <div style={styles.overviewCard}>
                   <div style={styles.overviewIcon}>⚡</div>
                   <div style={styles.overviewContent}>
                     <h3 style={styles.overviewTitle}>Sensor Response Optimization</h3>
                     <p style={styles.overviewText}>
                       Controlled heating patterns ensure consistent sensor responses and improve 
                       detection accuracy for various volatile organic compounds.
                     </p>
                   </div>
                 </div>
                 
                 <div style={styles.overviewCard}>
                   <div style={styles.overviewIcon}>🎯</div>
                   <div style={styles.overviewContent}>
                     <h3 style={styles.overviewTitle}>VOC Detection Fine-tuning</h3>
                     <p style={styles.overviewText}>
                       Profile-specific temperature sequences are calibrated for optimal detection 
                       of target compounds under specific testing conditions.
                     </p>
                   </div>
                 </div>
               </div>
               
               {/* Profile Performance Metrics */}
               <div style={styles.performanceMetrics}>
                 <h3 style={styles.metricsTitle}>📊 Profile Performance Analysis</h3>
                 <div style={styles.metricsGrid}>
                   <div style={styles.metricCard}>
                     <div style={styles.metricHeader}>
                       <span style={styles.metricLabel}>Highest Performance</span>
                       <span style={styles.metricValue}>Profile 338</span>
                     </div>
                     <div style={styles.metricBar}>
                       <div style={styles.metricBarFill}></div>
                     </div>
                     <p style={styles.metricDescription}>660 records - Optimal temperature ramping</p>
                   </div>
                   
                   <div style={styles.metricCard}>
                     <div style={styles.metricHeader}>
                       <span style={styles.metricLabel}>Average Performance</span>
                       <span style={styles.metricValue}>Profile 402</span>
                     </div>
                     <div style={styles.metricBar}>
                       <div style={{...styles.metricBarFill, width: '75%'}}></div>
                     </div>
                     <p style={styles.metricDescription}>646 records - Balanced heating strategy</p>
                   </div>
                   
                   <div style={styles.metricCard}>
                     <div style={styles.metricHeader}>
                       <span style={styles.metricLabel}>Research Focus</span>
                       <span style={styles.metricValue}>Profile 514</span>
                     </div>
                     <div style={styles.metricBar}>
                       <div style={{...styles.metricBarFill, width: '50%'}}></div>
                     </div>
                     <p style={styles.metricDescription}>463 records - Specialized temperature pattern</p>
                   </div>
                 </div>
               </div>
               
               {/* Detailed Profile Grid */}
               <div style={styles.profileGridHeader}>
                 <h3 style={styles.gridTitle}>🔬 Individual Profile Details</h3>
                 <p style={styles.gridSubtitle}>
                   Click on any profile to view detailed temperature ramping information and sensor response data
                 </p>
               </div>
               
               <div style={styles.heaterProfilesGrid}>
                 {stats.heaterProfiles?.map(profile => {
                   const profileCount = currentData.filter(row => 
                     (row.Heater_Profile || row.HeaterProfile) === profile
                   ).length;
                   
                                       // Calculate performance rating based on record count
                    const avgRecords = stats.heaterProfiles.reduce((sum, p) => 
                      sum + currentData.filter(row => (row.Heater_Profile || row.HeaterProfile) === p).length, 0
                    ) / stats.heaterProfiles.length;
                    
                    const performanceRating = (profileCount / avgRecords) * 100;
                    
                    // Determine profile category based on record count
                    let profileCategory = '';
                    let categoryColor = '';
                    if (profileCount >= avgRecords * 1.2) {
                      profileCategory = 'High Volume';
                      categoryColor = '#00ff88';
                    } else if (profileCount >= avgRecords * 0.8) {
                      profileCategory = 'Normal Volume';
                      categoryColor = '#00d4ff';
                    } else {
                      profileCategory = 'Low Volume';
                      categoryColor = '#ffaa00';
                    }
                   
                   return (
                     <div key={profile} style={styles.heaterProfileCard}>
                       <div style={styles.heaterProfileHeader}>
                         <div style={styles.heaterProfileIcon}>🔥</div>
                         <h3 style={styles.heaterProfileTitle}>Profile {profile}</h3>
                       </div>
                       
                                               <div style={styles.profilePerformance}>
                          <div style={styles.performanceBar}>
                            <div 
                              style={{
                                ...styles.performanceBarFill,
                                width: `${Math.min(performanceRating, 100)}%`,
                                background: categoryColor
                              }}
                            ></div>
                          </div>
                          <div style={styles.performanceLabel}>{profileCategory}</div>
                        </div>
                       
                       <div style={styles.heaterProfileCount}>{profileCount}</div>
                       <div style={styles.heaterProfileLabel}>Records</div>
                       
                       <div style={styles.profileDetails}>
                                                   <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Volume Ratio:</span>
                            <span style={styles.detailValue}>{(profileCount / avgRecords).toFixed(1)}x</span>
                          </div>
                         <div style={styles.detailRow}>
                           <span style={styles.detailLabel}>Category:</span>
                           <span style={{...styles.detailValue, color: categoryColor}}>{profileCategory}</span>
                         </div>
                                                   <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Status:</span>
                            <span style={styles.detailValue}>
                              {profileCount >= avgRecords * 0.8 ? '✅ Active' : '⚠️ Limited Data'}
                            </span>
                          </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
               
               {/* Technical Information */}
               <div style={styles.technicalInfo}>
                 <h3 style={styles.techTitle}>⚙️ Technical Specifications</h3>
                 <div style={styles.techGrid}>
                   <div style={styles.techCard}>
                     <h4 style={styles.techSubtitle}>Temperature Ramping Patterns</h4>
                     <ul style={styles.techList}>
                       <li>Controlled heating from ambient to target temperature</li>
                       <li>Variable ramp rates for different VOC sensitivities</li>
                       <li>Stabilization periods for consistent readings</li>
                       <li>Cooling cycles for sensor recovery</li>
                     </ul>
                   </div>
                   
                   <div style={styles.techCard}>
                     <h4 style={styles.techSubtitle}>Sensor Response Optimization</h4>
                     <ul style={styles.techList}>
                       <li>Temperature-dependent sensitivity calibration</li>
                       <li>Response time optimization for real-time detection</li>
                       <li>Cross-sensitivity reduction through heating control</li>
                       <li>Baseline drift compensation</li>
                     </ul>
                   </div>
                   
                   <div style={styles.techCard}>
                     <h4 style={styles.techSubtitle}>VOC Detection Strategy</h4>
                     <ul style={styles.techList}>
                       <li>Compound-specific temperature optimization</li>
                       <li>Environmental condition adaptation</li>
                       <li>Interference minimization protocols</li>
                       <li>Detection limit enhancement</li>
                     </ul>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Time Series Tab */}
        {activeTab === 'timeSeries' && (
          <div style={styles.chartContent}>
            <div style={styles.chartCard}>
              <h2 style={styles.chartTitle}>⏰ Sensor Time Series Analysis</h2>
              <Plot
                data={timeSeriesData}
                layout={{
                  title: `Time Series - ${selectedConfig.toUpperCase()}`,
                  xaxis: { title: 'Sample Index' },
                  yaxis: { title: 'Sensor Values' },
                  width: 800,
                  height: 500,
                  showlegend: true,
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: '#fff' }
                }}
                config={{ displayModeBar: true, displaylogo: false }}
              />
            </div>
          </div>
        )}

        {/* Correlation Tab */}
        {activeTab === 'correlation' && (
          <div style={styles.chartContent}>
            <div style={styles.chartCard}>
              <h2 style={styles.chartTitle}>🔗 Sensor Correlation Analysis</h2>
              <Plot
                data={correlationMatrix.data}
                layout={{
                  ...correlationMatrix.layout,
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: '#fff' }
                }}
                config={{ displayModeBar: true, displaylogo: false }}
              />
            </div>
          </div>
        )}

        {/* Distribution Tab */}
        {activeTab === 'distribution' && (
          <div style={styles.chartContent}>
            <div style={styles.chartCard}>
              <h2 style={styles.chartTitle}>📦 Sensor Distribution Analysis</h2>
              <Plot
                data={boxPlotData}
                layout={{
                  title: `Box Plot Distribution - ${selectedConfig.toUpperCase()}`,
                  xaxis: { title: 'Sensors' },
                  yaxis: { title: 'Values' },
                  width: 800,
                  height: 500,
                  showlegend: false,
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: '#fff' }
                }}
                config={{ displayModeBar: true, displaylogo: false }}
              />
            </div>
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div style={styles.downloadsContent}>
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>💾 Data Export Options</h2>
              <div style={styles.downloadGrid}>
                <div style={styles.downloadCard}>
                  <div style={styles.downloadIcon}>📊</div>
                  <h3 style={styles.downloadTitle}>Raw Data (CSV)</h3>
                  <p style={styles.downloadDescription}>
                    Download the complete raw sensor data for {selectedConfig}
                  </p>
                  <button 
                    onClick={() => downloadCSV(currentData, `${selectedConfig}_baseline_data.csv`)}
                    style={styles.downloadButton}
                  >
                    Download CSV
                  </button>
                </div>
                
                <div style={styles.downloadCard}>
                  <div style={styles.downloadIcon}>📈</div>
                  <h3 style={styles.downloadTitle}>Statistics Summary</h3>
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
                  <div style={styles.downloadIcon}>🔧</div>
                  <h3 style={styles.downloadTitle}>Configuration Files</h3>
                  <p style={styles.downloadDescription}>
                    Download individual configuration files
                  </p>
                  <div style={styles.multiDownloadButtons}>
                    <button 
                      onClick={() => downloadCSV(data['config_1_13'] || [], 'config_1_13_aug.csv')}
                      style={styles.smallDownloadButton}
                    >
                      Config 1 (13th)
                    </button>
                    <button 
                      onClick={() => downloadCSV(data['config_1_14'] || [], 'config_1_14_aug.csv')}
                      style={styles.smallDownloadButton}
                    >
                      Config 1 (14th)
                    </button>
                    <button 
                      onClick={() => downloadCSV(data['config_2_13'] || [], 'config_2_13_aug.csv')}
                      style={styles.smallDownloadButton}
                    >
                      Config 2 (13th)
                    </button>
                    <button 
                      onClick={() => downloadCSV(data['config_2_14'] || [], 'config_2_14_aug.csv')}
                      style={styles.smallDownloadButton}
                    >
                      Config 2 (14th)
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
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: '#fff',
    padding: '20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  
  // Header Styles
  header: {
    marginBottom: '30px'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  headerCenter: {
    textAlign: 'center',
    flex: 1
  },
  headerActions: {
    display: 'flex',
    gap: '15px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 10px 0',
    background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.8)',
    margin: '0'
  },
  
  // Button Styles
  backButton: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '25px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  logoutButton: {
    padding: '12px 24px',
    background: 'rgba(255,0,0,0.2)',
    border: '1px solid rgba(255,0,0,0.3)',
    borderRadius: '25px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  themeButton: {
    padding: '12px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  // Configuration Selector
  configSelector: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'center'
  },
  configCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '20px 30px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  configLabel: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#fff'
  },
  configSelect: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
    border: '1px solid rgba(0,212,255,0.5)',
    borderRadius: '15px',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    outline: 'none',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(0,212,255,0.3)',
    transition: 'all 0.3s ease'
  },
  
  // Dropdown option styling
  configSelectOption: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '8px 12px'
  },
  
  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '25px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  statIcon: {
    fontSize: '3rem',
    color: '#00d4ff'
  },
  statContent: {
    flex: 1
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500'
  },
  
  // Tab Navigation
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  tab: {
    padding: '15px 25px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '25px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  activeTab: {
    background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
    border: '1px solid rgba(0,212,255,0.5)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,212,255,0.3)'
  },
  tabIcon: {
    fontSize: '1.2rem'
  },
  
  // Tab Content
  tabContent: {
    minHeight: '500px'
  },
  
  // Overview Content
  overviewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  
  // Section Styles
  section: {
    background: 'rgba(255,255,255,0.05)',
    padding: '30px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)'
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: '0 0 25px 0',
    color: '#00d4ff',
    textAlign: 'center'
  },
  
  // Sensor Stats Grid
  sensorStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  sensorStatCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '25px',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease'
  },
  sensorStatHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '15px'
  },
  sensorStatIcon: {
    fontSize: '2rem',
    color: '#00d4ff'
  },
  sensorStatTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0'
  },
  sensorStatMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  sensorStatRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  sensorStatLabel: {
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)'
  },
  sensorStatValue: {
    color: '#00d4ff',
    fontFamily: 'monospace',
    fontWeight: '600'
  },
  
  // Heater Profiles Grid
  heaterProfilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  heaterProfileCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '25px',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  heaterProfileHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '15px'
  },
  heaterProfileIcon: {
    fontSize: '1.5rem',
    color: '#ff6b6b'
  },
  heaterProfileTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#fff',
    margin: '0'
  },
  heaterProfileCount: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#ff6b6b',
    marginBottom: '5px'
  },
     heaterProfileLabel: {
     fontSize: '0.9rem',
     color: 'rgba(255,255,255,0.7)'
   },
   
   // Enhanced Heater Profile Styles
   profileOverview: {
     display: 'grid',
     gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
     gap: '20px',
     marginBottom: '30px'
   },
   overviewCard: {
     background: 'rgba(255,255,255,0.1)',
     padding: '25px',
     borderRadius: '15px',
     border: '1px solid rgba(255,255,255,0.2)',
     backdropFilter: 'blur(10px)',
     transition: 'all 0.3s ease'
   },
   overviewIcon: {
     fontSize: '2.5rem',
     color: '#00d4ff',
     marginBottom: '15px'
   },
   overviewTitle: {
     fontSize: '1.2rem',
     fontWeight: '700',
     color: '#fff',
     margin: '0 0 10px 0'
   },
   overviewText: {
     color: 'rgba(255,255,255,0.8)',
     lineHeight: '1.6',
     margin: '0'
   },
   
   // Performance Metrics
   performanceMetrics: {
     marginBottom: '30px'
   },
   metricsTitle: {
     fontSize: '1.5rem',
     fontWeight: '700',
     color: '#00d4ff',
     margin: '0 0 20px 0',
     textAlign: 'center'
   },
   metricsGrid: {
     display: 'grid',
     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
     gap: '20px'
   },
   metricCard: {
     background: 'rgba(255,255,255,0.1)',
     padding: '20px',
     borderRadius: '15px',
     border: '1px solid rgba(255,255,255,0.2)',
     backdropFilter: 'blur(10px)',
     textAlign: 'center'
   },
   metricHeader: {
     display: 'flex',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: '15px'
   },
   metricLabel: {
     fontWeight: '600',
     color: 'rgba(255,255,255,0.8)'
   },
   metricValue: {
     fontSize: '1.1rem',
     fontWeight: '700',
     color: '#00d4ff'
   },
   metricBar: {
     height: '8px',
     backgroundColor: 'rgba(255,255,255,0.2)',
     borderRadius: '4px',
     overflow: 'hidden',
     marginBottom: '10px'
   },
   metricBarFill: {
     height: '100%',
     backgroundColor: '#00d4ff',
     borderRadius: '4px',
     transition: 'width 0.3s ease'
   },
   metricDescription: {
     fontSize: '0.9rem',
     color: 'rgba(255,255,255,0.7)',
     margin: '0'
   },
   
   // Profile Grid Header
   profileGridHeader: {
     textAlign: 'center',
     marginBottom: '25px'
   },
   gridTitle: {
     fontSize: '1.4rem',
     fontWeight: '700',
     color: '#00d4ff',
     margin: '0 0 10px 0'
   },
   gridSubtitle: {
     color: 'rgba(255,255,255,0.8)',
     margin: '0'
   },
   
   // Enhanced Profile Cards
   profilePerformance: {
     marginBottom: '15px'
   },
   performanceBar: {
     height: '6px',
     backgroundColor: 'rgba(255,255,255,0.2)',
     borderRadius: '3px',
     overflow: 'hidden',
     marginBottom: '8px'
   },
   performanceBarFill: {
     height: '100%',
     backgroundColor: '#00d4ff',
     borderRadius: '3px',
     transition: 'width 0.3s ease'
   },
   performanceLabel: {
     fontSize: '0.8rem',
     color: 'rgba(255,255,255,0.7)',
     fontWeight: '500'
   },
   profileDetails: {
     marginTop: '15px',
     padding: '15px',
     background: 'rgba(255,255,255,0.05)',
     borderRadius: '10px',
     border: '1px solid rgba(255,255,255,0.1)'
   },
   detailRow: {
     display: 'flex',
     justifyContent: 'space-between',
     alignItems: 'center',
     padding: '5px 0',
     borderBottom: '1px solid rgba(255,255,255,0.1)'
   },
   detailLabel: {
     fontSize: '0.8rem',
     color: 'rgba(255,255,255,0.7)',
     fontWeight: '500'
   },
   detailValue: {
     fontSize: '0.8rem',
     fontWeight: '600',
     color: '#00d4ff'
   },
   
   // Technical Information
   technicalInfo: {
     marginTop: '30px'
   },
   techTitle: {
     fontSize: '1.5rem',
     fontWeight: '700',
     color: '#00d4ff',
     margin: '0 0 20px 0',
     textAlign: 'center'
   },
   techGrid: {
     display: 'grid',
     gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
     gap: '20px'
   },
   techCard: {
     background: 'rgba(255,255,255,0.1)',
     padding: '25px',
     borderRadius: '15px',
     border: '1px solid rgba(255,255,255,0.2)',
     backdropFilter: 'blur(10px)'
   },
   techSubtitle: {
     fontSize: '1.1rem',
     fontWeight: '600',
     color: '#fff',
     margin: '0 0 15px 0'
   },
   techList: {
     color: 'rgba(255,255,255,0.8)',
     lineHeight: '1.6',
     margin: '0',
     paddingLeft: '20px'
   },
  
  // Chart Content
  chartContent: {
    display: 'flex',
    justifyContent: 'center'
  },
  chartCard: {
    background: 'rgba(255,255,255,0.05)',
    padding: '30px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    textAlign: 'center'
  },
  chartTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: '0 0 25px 0',
    color: '#00d4ff'
  },
  
  // Downloads Content
  downloadsContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  downloadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px'
  },
  downloadCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '30px',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  downloadIcon: {
    fontSize: '3rem',
    color: '#00d4ff',
    marginBottom: '20px'
  },
  downloadTitle: {
    fontSize: '1.4rem',
    color: '#fff',
    margin: '0 0 15px 0',
    fontWeight: '600'
  },
  downloadDescription: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '25px',
    lineHeight: '1.6'
  },
  downloadButton: {
    padding: '15px 30px',
    background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,212,255,0.3)'
  },
  multiDownloadButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  smallDownloadButton: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '15px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  
  // Loading and Error States
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: '#fff'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid #00d4ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    fontSize: '1.5rem',
    color: '#fff'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: '#fff'
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  errorText: {
    fontSize: '1.5rem',
    color: '#fff',
    marginBottom: '20px'
  },
  retryButton: {
    padding: '15px 30px',
    background: 'rgba(255,0,0,0.2)',
    border: '1px solid rgba(255,0,0,0.3)',
    borderRadius: '25px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  }
};

// Add CSS animation for loading spinner and dropdown styling
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Dropdown option styling for better contrast */
  select option {
    background-color: #1a1a2e !important;
    color: #ffffff !important;
    padding: 8px 12px !important;
  }
  
  select option:hover {
    background-color: #00d4ff !important;
    color: #1a1a2e !important;
  }
  
  select option:checked {
    background-color: #0099cc !important;
    color: #ffffff !important;
  }
`;
document.head.appendChild(style);

export default BaselineDashboard;
