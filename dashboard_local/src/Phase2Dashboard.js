import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
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
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginTop: '20px',
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
    marginBottom: '15px',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '15px',
  },
  heaterProfileItem: {
    background: 'rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  heaterProfileValue: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#4fc3f7',
    marginBottom: '10px',
  },
  heaterProfileStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '10px',
  },
  heaterProfileStat: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.8)',
  },
  heaterProfileStatValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#4fc3f7',
  },
  downloadSection: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '15px',
    textAlign: 'center',
  },
  downloadButton: {
    background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    margin: '10px',
  },
  downloadButtonHover: {
    background: 'linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)',
    transform: 'scale(1.05)',
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    fontSize: '0.9rem',
  },
  tableHeader: {
    background: 'rgba(255,255,255,0.1)',
    padding: '10px',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  tableCell: {
    padding: '8px 10px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
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
  phaseStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '15px',
  },
  phaseCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  phaseTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '10px',
    color: '#4fc3f7',
  },
  sensorComparison: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginTop: '15px',
  },
  sensorCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  sensorTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '10px',
    color: '#4fc3f7',
  },
  sensorStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  sensorStat: {
    textAlign: 'center',
    padding: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '5px',
  },
  sensorStatValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#4fc3f7',
  },
  sensorStatLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.7)',
  },
};

export default function Phase2Dashboard() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [downloadHovered, setDownloadHovered] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/Phase2/01Aug_Phase2_Ammonia.csv');
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

  const calculateStats = (data) => {
    if (!data || data.length === 0) return {};

    const phases = ['Pre-Puff', 'Puff', 'Post-Puff'];
    const stats = {};

    // Overall stats
    stats.totalRecords = data.length;
    stats.uniqueHeaterProfiles = [...new Set(data.map(row => row.Heater_Profile))].length;
    stats.avgBMEHeaterRes = data.reduce((sum, row) => sum + parseFloat(row.BME_HeaterRes || 0), 0) / data.length;

    // Phase-specific stats
    stats.phases = {};
    phases.forEach(phase => {
      const phaseData = data.filter(row => row.Phase === phase);
      if (phaseData.length > 0) {
        stats.phases[phase] = {
          count: phaseData.length,
          avgMQ136: phaseData.reduce((sum, row) => sum + parseFloat(row.MQ136_RAW || 0), 0) / phaseData.length,
          avgMQ138: phaseData.reduce((sum, row) => sum + parseFloat(row.MQ138_RAW || 0), 0) / phaseData.length,
          avgBME_Temp: phaseData.reduce((sum, row) => sum + parseFloat(row.BME_Temp || 0), 0) / phaseData.length,
          avgBME_Hum: phaseData.reduce((sum, row) => sum + parseFloat(row.BME_Hum || 0), 0) / phaseData.length,
          avgBME_HeaterRes: phaseData.reduce((sum, row) => sum + parseFloat(row.BME_HeaterRes || 0), 0) / phaseData.length,
          avgAlpha_PID: phaseData.reduce((sum, row) => sum + parseFloat(row.Alpha_PID || 0), 0) / phaseData.length,
          avgSPEC: phaseData.reduce((sum, row) => sum + parseFloat(row.SPEC || 0), 0) / phaseData.length,
          avgSGP40_VOC: phaseData.reduce((sum, row) => sum + parseFloat(row.SGP40_VOC || 0), 0) / phaseData.length,
        };
      }
    });

    // Detailed Heater Profile analysis with BME stats
    const heaterProfileStats = {};
    data.forEach(row => {
      const profile = row.Heater_Profile;
      if (!heaterProfileStats[profile]) {
        heaterProfileStats[profile] = {
          count: 0,
          bmeValues: [],
          mq136Values: [],
          mq138Values: [],
          alphaPIDValues: [],
          specValues: [],
          sgp40Values: []
        };
      }
      heaterProfileStats[profile].count++;
      heaterProfileStats[profile].bmeValues.push(parseFloat(row.BME_HeaterRes || 0));
      heaterProfileStats[profile].mq136Values.push(parseFloat(row.MQ136_RAW || 0));
      heaterProfileStats[profile].mq138Values.push(parseFloat(row.MQ138_RAW || 0));
      heaterProfileStats[profile].alphaPIDValues.push(parseFloat(row.Alpha_PID || 0));
      heaterProfileStats[profile].specValues.push(parseFloat(row.SPEC || 0));
      heaterProfileStats[profile].sgp40Values.push(parseFloat(row.SGP40_VOC || 0));
    });

    // Calculate min/max for each heater profile
    Object.keys(heaterProfileStats).forEach(profile => {
      const stats = heaterProfileStats[profile];
      stats.bmeMin = Math.min(...stats.bmeValues);
      stats.bmeMax = Math.max(...stats.bmeValues);
      stats.bmeAvg = stats.bmeValues.reduce((sum, val) => sum + val, 0) / stats.bmeValues.length;
      stats.mq136Avg = stats.mq136Values.reduce((sum, val) => sum + val, 0) / stats.mq136Values.length;
      stats.mq138Avg = stats.mq138Values.reduce((sum, val) => sum + val, 0) / stats.mq138Values.length;
      stats.alphaPIDAvg = stats.alphaPIDValues.reduce((sum, val) => sum + val, 0) / stats.alphaPIDValues.length;
      stats.specAvg = stats.specValues.reduce((sum, val) => sum + val, 0) / stats.specValues.length;
      stats.sgp40Avg = stats.sgp40Values.reduce((sum, val) => sum + val, 0) / stats.sgp40Values.length;
    });

    stats.heaterProfiles = heaterProfileStats;

    // BME_HeaterRes analysis
    const bmeHeaterResValues = data.map(row => parseFloat(row.BME_HeaterRes || 0));
    stats.bmeHeaterResStats = {
      min: Math.min(...bmeHeaterResValues),
      max: Math.max(...bmeHeaterResValues),
      avg: bmeHeaterResValues.reduce((sum, val) => sum + val, 0) / bmeHeaterResValues.length,
      std: Math.sqrt(bmeHeaterResValues.reduce((sum, val) => sum + Math.pow(val - stats.avgBMEHeaterRes, 2), 0) / bmeHeaterResValues.length),
    };

    return stats;
  };

  const handleDownloadCSV = () => {
    if (!data) return;
    
    // Convert data back to CSV format
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Phase2_Ammonia_Data.csv';
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

  const stats = calculateStats(data);

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

      <h1 style={styles.header}>Phase 2 Bio Lab Testing Dashboard</h1>

      <div style={styles.content}>
        {/* Overview Stats */}
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

        {/* Detailed Heater Profile Analysis */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔥 Detailed Heater Profile Analysis</h2>
          <div style={styles.heaterProfileSection}>
            <div style={styles.heaterProfileGrid}>
              {Object.entries(stats.heaterProfiles || {}).map(([profile, profileStats]) => (
                <div key={profile} style={styles.heaterProfileItem}>
                  <div style={styles.heaterProfileValue}>Profile {profile}</div>
                  <div style={styles.heaterProfileStats}>
                    <div style={styles.heaterProfileStat}>
                      <div style={styles.heaterProfileStatValue}>{profileStats.count}</div>
                      <div>Records</div>
                    </div>
                    <div style={styles.heaterProfileStat}>
                      <div style={styles.heaterProfileStatValue}>{profileStats.bmeMin?.toLocaleString()}</div>
                      <div>BME Min</div>
                    </div>
                    <div style={styles.heaterProfileStat}>
                      <div style={styles.heaterProfileStatValue}>{profileStats.bmeMax?.toLocaleString()}</div>
                      <div>BME Max</div>
                    </div>
                    <div style={styles.heaterProfileStat}>
                      <div style={styles.heaterProfileStatValue}>{profileStats.bmeAvg?.toFixed(0)}</div>
                      <div>BME Avg</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CSV Download Section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📥 Data Export</h2>
          <div style={styles.downloadSection}>
            <p style={{ marginBottom: '15px', color: 'rgba(255,255,255,0.8)' }}>
              Download the complete Phase 2 Ammonia dataset for further analysis
            </p>
            <button
              style={downloadHovered ? { ...styles.downloadButton, ...styles.downloadButtonHover } : styles.downloadButton}
              onClick={handleDownloadCSV}
              onMouseEnter={() => setDownloadHovered(true)}
              onMouseLeave={() => setDownloadHovered(false)}
            >
              📄 Download Phase 2 CSV
            </button>
          </div>
        </div>

        {/* BME Heater Resistance Analysis */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🌡️ BME Heater Resistance Analysis</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.bmeHeaterResStats?.min?.toLocaleString()}</div>
              <div style={styles.statLabel}>Min Value</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.bmeHeaterResStats?.max?.toLocaleString()}</div>
              <div style={styles.statLabel}>Max Value</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.bmeHeaterResStats?.avg?.toFixed(0)}</div>
              <div style={styles.statLabel}>Average</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.bmeHeaterResStats?.std?.toFixed(0)}</div>
              <div style={styles.statLabel}>Std Deviation</div>
            </div>
          </div>
        </div>

        {/* Phase Analysis */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>⏱️ Phase Analysis</h2>
          <div style={styles.phaseStats}>
            {Object.entries(stats.phases || {}).map(([phase, phaseStats]) => (
              <div key={phase} style={styles.phaseCard}>
                <div style={styles.phaseTitle}>{phase}</div>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>{phaseStats.count}</div>
                    <div style={styles.statLabel}>Records</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>{phaseStats.avgBME_HeaterRes?.toFixed(0)}</div>
                    <div style={styles.statLabel}>Avg BME Heater Res</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sensor Comparison */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📡 Sensor Comparison</h2>
          <div style={styles.sensorComparison}>
            <div style={styles.sensorCard}>
              <div style={styles.sensorTitle}>MQ136 Sensor</div>
              <div style={styles.sensorStats}>
                <div style={styles.sensorStat}>
                  <div style={styles.sensorStatValue}>
                    {stats.phases?.Puff?.avgMQ136?.toFixed(2)}
                  </div>
                  <div style={styles.sensorStatLabel}>Puff Avg</div>
                </div>
                <div style={styles.sensorStat}>
                  <div style={styles.sensorStatValue}>
                    {stats.phases?.['Pre-Puff']?.avgMQ136?.toFixed(2)}
                  </div>
                  <div style={styles.sensorStatLabel}>Pre-Puff Avg</div>
                </div>
              </div>
            </div>

            <div style={styles.sensorCard}>
              <div style={styles.sensorTitle}>MQ138 Sensor</div>
              <div style={styles.sensorStats}>
                <div style={styles.sensorStat}>
                  <div style={styles.sensorStatValue}>
                    {stats.phases?.Puff?.avgMQ138?.toFixed(2)}
                  </div>
                  <div style={styles.sensorStatLabel}>Puff Avg</div>
                </div>
                <div style={styles.sensorStat}>
                  <div style={styles.sensorStatValue}>
                    {stats.phases?.['Pre-Puff']?.avgMQ138?.toFixed(2)}
                  </div>
                  <div style={styles.sensorStatLabel}>Pre-Puff Avg</div>
                </div>
              </div>
            </div>

            <div style={styles.sensorCard}>
              <div style={styles.sensorTitle}>Alpha PID</div>
              <div style={styles.sensorStats}>
                <div style={styles.sensorStat}>
                  <div style={styles.sensorStatValue}>
                    {stats.phases?.Puff?.avgAlpha_PID?.toFixed(2)}
                  </div>
                  <div style={styles.sensorStatLabel}>Puff Avg</div>
                </div>
                <div style={styles.sensorStat}>
                  <div style={styles.sensorStatValue}>
                    {stats.phases?.['Pre-Puff']?.avgAlpha_PID?.toFixed(2)}
                  </div>
                  <div style={styles.sensorStatLabel}>Pre-Puff Avg</div>
                </div>
              </div>
            </div>

            <div style={styles.sensorCard}>
              <div style={styles.sensorTitle}>SPEC Sensor</div>
              <div style={styles.sensorStats}>
                <div style={styles.sensorStat}>
                  <div style={styles.sensorStatValue}>
                    {stats.phases?.Puff?.avgSPEC?.toFixed(2)}
                  </div>
                  <div style={styles.sensorStatLabel}>Puff Avg</div>
                </div>
                <div style={styles.sensorStat}>
                  <div style={styles.sensorStatValue}>
                    {stats.phases?.['Pre-Puff']?.avgSPEC?.toFixed(2)}
                  </div>
                  <div style={styles.sensorStatLabel}>Pre-Puff Avg</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Conditions */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🌡️ Environmental Conditions</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.phases?.Puff?.avgBME_Temp?.toFixed(1)}°C</div>
              <div style={styles.statLabel}>Puff Temperature</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.phases?.Puff?.avgBME_Hum?.toFixed(1)}%</div>
              <div style={styles.statLabel}>Puff Humidity</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.phases?.['Pre-Puff']?.avgBME_Temp?.toFixed(1)}°C</div>
              <div style={styles.statLabel}>Pre-Puff Temperature</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.phases?.['Pre-Puff']?.avgBME_Hum?.toFixed(1)}%</div>
              <div style={styles.statLabel}>Pre-Puff Humidity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 