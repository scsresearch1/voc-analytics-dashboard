import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: '40px',
    textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.10)',
  },
  content: {
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(12px)',
    border: '1.5px solid rgba(255,255,255,0.25)',
    padding: '40px',
    maxWidth: '1200px',
    width: '100%',
    color: '#fff',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: '20px',
    color: '#fff',
    borderBottom: '2px solid rgba(255,255,255,0.3)',
    paddingBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionContent: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(255,255,255,0.9)',
  },
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  legendCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  legendTitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
    marginBottom: '10px',
    color: '#90caf9',
  },
  legendDescription: {
    fontSize: '1rem',
    lineHeight: '1.5',
    color: 'rgba(255,255,255,0.8)',
  },
  downloadSection: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '25px',
    marginTop: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
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
  },
  downloadButtonHover: {
    background: 'linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)',
    transform: 'scale(1.05)',
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
  },
  tableHeader: {
    background: 'rgba(255,255,255,0.1)',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  highlight: {
    color: '#ffd700',
    fontWeight: 600,
  },
  code: {
    background: 'rgba(0,0,0,0.3)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
  },
  enumList: {
    margin: '8px 0',
    paddingLeft: '20px',
  },
  enumItem: {
    marginBottom: '4px',
    color: 'rgba(255,255,255,0.8)',
  },
};

export default function DataFormat() {
  const navigate = useNavigate();
  const [hovered, setHovered] = React.useState(false);
  const [downloadHovered, setDownloadHovered] = React.useState(false);

  const handleBack = () => {
    navigate('/options');
  };

  const handleDownloadSample = () => {
    // Create sample CSV content with actual column structure
    const sampleData = `SNO,Date,Time,Phase,Heater_Profile,MQ136_RAW,MQ138_RAW,BME1_Temp,BME1_Hum,BME1_HeaterRes,SGP40_VOC,Activated,Concentration,Distance
1,2024-01-01,10:00:00:123456,Pre-Puff,322,125.5,89.2,23.4,45.6,1024,156,None,0 ppm,30
2,2024-01-01,10:01:00:234567,Pre-Puff,338,126.1,89.8,23.6,45.8,1025,158,None,0 ppm,30
3,2024-01-01,10:02:00:345678,Pre-Puff,354,125.8,89.5,23.5,45.7,1024,157,None,0 ppm,30
4,2024-01-01,10:03:00:456789,Puff,370,145.2,95.6,25.2,48.9,1150,245,Toluene,2 ppm,30
5,2024-01-01,10:04:00:567890,Puff,386,145.8,96.1,25.4,49.1,1152,248,Toluene,2 ppm,30
6,2024-01-01,10:05:00:678901,Puff,402,145.5,95.8,25.3,49.0,1151,246,Toluene,2 ppm,30
7,2024-01-01,10:06:00:789012,Puff,418,147.2,97.6,25.6,49.3,1155,252,Toluene,2 ppm,30
8,2024-01-01,10:07:00:890123,Puff,434,148.1,98.1,25.8,49.5,1158,255,Toluene,2 ppm,30
9,2024-01-01,10:08:00:901234,Post-Puff,450,135.2,92.6,24.2,47.9,1080,180,None,0 ppm,30
10,2024-01-01,10:09:00:012345,Post-Puff,466,134.8,92.1,24.0,47.7,1078,178,None,0 ppm,30
11,2024-01-01,10:10:00:123456,Post-Puff,482,134.5,91.8,23.9,47.6,1077,177,None,0 ppm,30
12,2024-01-01,10:11:00:234567,Post-Puff,498,134.2,91.5,23.8,47.5,1076,176,None,0 ppm,30`;

    // Create and download file
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VOC_Sample_Data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const legends = [
    {
      title: '📊 Sensor Data',
      description: 'Raw sensor readings from MQ gas sensors and BME680 environmental sensor.',
      details: [
        { sensor: 'MQ136_RAW', description: 'Raw analog value from MQ136 sensor (12-bit ADC)' },
        { sensor: 'MQ138_RAW', description: 'Raw analog value from MQ138 sensor (12-bit ADC)' },
        { sensor: 'BME1_Temp', description: 'Temperature reading from BME680 sensor (°C)' },
        { sensor: 'BME1_Hum', description: 'Relative humidity reading from BME680 sensor (%)' },
        { sensor: 'BME1_HeaterRes', description: 'Raw ADC value indicating heater resistance of BME680' },
        { sensor: 'SGP40_VOC', description: 'Digital VOC index from SGP40 sensor (compensated using temperature and humidity)' }
      ]
    },
    {
      title: '⏱️ Time & Experiment Data',
      description: 'Timestamps and experiment phase information for tracking VOC testing sessions.',
      details: [
        { sensor: 'SNO', description: 'Serial counter of each log entry (increments every second)' },
        { sensor: 'Date', description: 'NTP-synchronized local date (YYYY-MM-DD format)' },
        { sensor: 'Time', description: 'Local time with microsecond precision (HH:MM:SS:μs format)' },
        { sensor: 'Phase', description: 'Experiment phase: Pre-Puff (2 min), Puff (5 min), Post-Puff (10 min)' },
        { sensor: 'Heater_Profile', description: 'BME680 heater profile temperature value (cycles through 15 values: 322-602)' }
      ]
    },
    {
      title: '🧪 VOC Testing Parameters',
      description: 'Information about the VOC being tested and experimental conditions.',
      details: [
        { sensor: 'Activated', description: 'Name of the active VOC under test (e.g., Toluene, 1-Octen-3-ol)' },
        { sensor: 'Concentration', description: 'Known concentration label of the tested VOC (e.g., 2 ppm, 5 ppm)' },
        { sensor: 'Distance', description: 'Distance between sensor and VOC source (cm or ft depending on protocol)' }
      ]
    },
    {
      title: '🔍 Analysis Features',
      description: 'The dashboard provides comprehensive analytics for VOC detection and analysis.',
      details: [
        { sensor: 'Summary Stats', description: 'Statistical analysis of sensor readings across phases' },
        { sensor: 'Correlation Matrix', description: 'Inter-sensor correlation analysis for pattern detection' },
        { sensor: 'Heatmap', description: 'Visual representation of VOC concentration patterns over time' },
        { sensor: 'Boxplot', description: 'Distribution analysis of sensor readings by phase' }
      ]
    }
  ];

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
      
      <h1 style={styles.header}>Data Format & Legends</h1>
      
      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            📋 Data Format Specifications
          </h2>
          <div style={styles.sectionContent}>
            <p>
              The VOC Analytics Platform uses <span style={styles.highlight}>CSV (Comma-Separated Values)</span> format for data storage and exchange. 
              Each file contains time-series data from multiple sensors with the following structure:
            </p>
            
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Column Name</th>
                  <th style={styles.tableHeader}>Type</th>
                  <th style={styles.tableHeader}>Description</th>
                  <th style={styles.tableHeader}>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>SNO</span></td>
                  <td style={styles.tableCell}>Integer</td>
                  <td style={styles.tableCell}>Serial counter of each log entry. Increments every second.</td>
                  <td style={styles.tableCell}>1, 2, 3...</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>Date</span></td>
                  <td style={styles.tableCell}>String</td>
                  <td style={styles.tableCell}>NTP-synchronized local date in the format YYYY-MM-DD.</td>
                  <td style={styles.tableCell}>2024-01-01</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>Time</span></td>
                  <td style={styles.tableCell}>String</td>
                  <td style={styles.tableCell}>Local time with microsecond precision, formatted as HH:MM:SS:μs.</td>
                  <td style={styles.tableCell}>10:00:00:123456</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>Phase</span></td>
                  <td style={styles.tableCell}>String (Enum)</td>
                  <td style={styles.tableCell}>
                    Experiment phase:
                    <ul style={styles.enumList}>
                      <li style={styles.enumItem}>• Pre-Puff (2 minutes)</li>
                      <li style={styles.enumItem}>• Puff (5 minutes)</li>
                      <li style={styles.enumItem}>• Post-Puff (10 minutes)</li>
                    </ul>
                  </td>
                  <td style={styles.tableCell}>Pre-Puff, Puff, Post-Puff</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>Heater_Profile</span></td>
                  <td style={styles.tableCell}>Integer</td>
                  <td style={styles.tableCell}>
                    BME680 heater profile temperature value. Cycles through:
                    <br />[322, 338, 354, 370, 386, 402, 418, 434, 450, 466, 482, 498, 514, 530, 602]
                  </td>
                  <td style={styles.tableCell}>322, 338, 354...</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>MQ136_RAW</span></td>
                  <td style={styles.tableCell}>Float</td>
                  <td style={styles.tableCell}>Raw analog value from MQ136 sensor (12-bit ADC).</td>
                  <td style={styles.tableCell}>125.5</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>MQ138_RAW</span></td>
                  <td style={styles.tableCell}>Float</td>
                  <td style={styles.tableCell}>Raw analog value from MQ138 sensor (12-bit ADC).</td>
                  <td style={styles.tableCell}>89.2</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>BME1_Temp</span></td>
                  <td style={styles.tableCell}>Float</td>
                  <td style={styles.tableCell}>Temperature reading from BME680 sensor.</td>
                  <td style={styles.tableCell}>23.4</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>BME1_Hum</span></td>
                  <td style={styles.tableCell}>Float</td>
                  <td style={styles.tableCell}>Relative humidity reading from BME680 sensor.</td>
                  <td style={styles.tableCell}>45.6</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>BME1_HeaterRes</span></td>
                  <td style={styles.tableCell}>Integer</td>
                  <td style={styles.tableCell}>Raw ADC value indicating heater resistance of BME680.</td>
                  <td style={styles.tableCell}>1024</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>SGP40_VOC</span></td>
                  <td style={styles.tableCell}>Integer</td>
                  <td style={styles.tableCell}>Digital VOC index from SGP40 sensor (compensated using temperature and humidity).</td>
                  <td style={styles.tableCell}>156</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>Activated</span></td>
                  <td style={styles.tableCell}>String</td>
                  <td style={styles.tableCell}>Name of the active VOC under test (e.g., Toluene, 1-Octen-3-ol).</td>
                  <td style={styles.tableCell}>Toluene, 1-Octen-3-ol</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>Concentration</span></td>
                  <td style={styles.tableCell}>String</td>
                  <td style={styles.tableCell}>Known concentration label of the tested VOC (e.g., 2 ppm, 5 ppm).</td>
                  <td style={styles.tableCell}>2 ppm, 5 ppm</td>
                </tr>
                <tr>
                  <td style={styles.tableCell}><span style={styles.code}>Distance</span></td>
                  <td style={styles.tableCell}>Integer</td>
                  <td style={styles.tableCell}>Distance between sensor and VOC source, in cm or ft depending on experiment protocol.</td>
                  <td style={styles.tableCell}>30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            📖 Legends & Explanations
          </h2>
          <div style={styles.sectionContent}>
            <p>
              Understanding the sensor data and analysis features is crucial for interpreting VOC analytics results.
              Below are detailed explanations of each component:
            </p>
            
            <div style={styles.legendGrid}>
              {legends.map((legend, index) => (
                <div key={index} style={styles.legendCard}>
                  <h3 style={styles.legendTitle}>{legend.title}</h3>
                  <p style={styles.legendDescription}>{legend.description}</p>
                  {legend.details && (
                    <div style={{ marginTop: '15px' }}>
                      {legend.details.map((detail, idx) => (
                        <div key={idx} style={{ marginBottom: '8px' }}>
                          <strong style={{ color: '#90caf9' }}>{detail.sensor}:</strong> {detail.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div style={styles.downloadSection}>
          <h2 style={styles.sectionTitle}>
            📥 Download Sample File
          </h2>
          <div style={styles.sectionContent}>
            <p>
              Download a sample CSV file to understand the exact format and structure used in the VOC Analytics Platform.
              This sample includes all sensor types and demonstrates the complete data format with realistic values.
            </p>
            <button
              style={downloadHovered ? { ...styles.downloadButton, ...styles.downloadButtonHover } : styles.downloadButton}
              onClick={handleDownloadSample}
              onMouseEnter={() => setDownloadHovered(true)}
              onMouseLeave={() => setDownloadHovered(false)}
            >
              📄 Download Sample CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 