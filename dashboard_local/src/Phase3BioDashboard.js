import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    padding: '20px',
  },
  container: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '30px',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(31, 38, 135, 0.2)',
    marginBottom: '20px',
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
  title: {
    fontSize: '1.6rem',
    fontWeight: 700,
    marginBottom: '25px',
    color: '#fff',
    borderBottom: '2px solid rgba(255,255,255,0.3)',
    paddingBottom: '12px',
    textAlign: 'center',
  },
  navTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px',
    justifyContent: 'center',
  },
  tab: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  activeTab: {
    background: 'rgba(0, 200, 255, 0.3)',
    border: '1px solid rgba(0, 200, 255, 0.5)',
    transform: 'scale(1.05)',
  },
  tabContent: {
    display: 'none',
  },
  activeTabContent: {
    display: 'block',
  },
  sectionCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    marginBottom: '20px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dataFormatTable: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tableHeader: {
    background: 'rgba(0, 200, 255, 0.2)',
    padding: '15px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#fff',
  },
  tableCell: {
    padding: '12px 15px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.8)',
  },
  waitingCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    border: '2px dashed rgba(255,255,255,0.3)',
  },
  waitingIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
    display: 'block',
  },
  waitingTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    marginBottom: '10px',
    color: '#fff',
  },
  waitingDescription: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '20px',
  },
  vocList: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  vocItem: {
    background: 'rgba(0, 200, 255, 0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0, 200, 255, 0.3)',
  },
  vocItemHover: {
    background: 'rgba(0, 200, 255, 0.4)',
    transform: 'scale(1.05)',
    border: '1px solid rgba(0, 200, 255, 0.6)',
  },
  vocExpanded: {
    background: 'rgba(0, 200, 255, 0.3)',
    border: '1px solid rgba(0, 200, 255, 0.6)',
  },
  vocFeatures: {
    marginTop: '15px',
    padding: '20px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  featureTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '15px',
    textAlign: 'center',
  },
  featureList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    marginBottom: '20px',
  },
  featureItem: {
    background: 'rgba(255,255,255,0.1)',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.8)',
  },
  dataSection: {
    marginTop: '20px',
    padding: '15px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  waitingBadge: {
    background: 'rgba(255, 193, 7, 0.2)',
    color: '#ffc107',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    marginLeft: 'auto',
  },
  downloadButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  downloadButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'not-allowed',
    fontSize: '0.85rem',
    fontWeight: 600,
    opacity: 0.6,
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px',
    marginTop: '10px',
  },
  analyticsItem: {
    background: 'rgba(255,255,255,0.05)',
    padding: '10px',
    borderRadius: '6px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  analyticsLabel: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '5px',
  },
  analyticsValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
  },
};

const Phase3BioDashboard = () => {
  const navigate = useNavigate();
  const [backButtonHover, setBackButtonHover] = useState(false);
  const [activeTab, setActiveTab] = useState('data-format');
  const [expandedVOC, setExpandedVOC] = useState(null);

  const dataFormatColumns = [
    { column: 'Date', description: 'Date of measurement (DD MM YYYY format)' },
    { column: 'Time', description: 'Timestamp of measurement up to nanoseconds (HH:MM:SS.nnnnnnnnn format)' },
    { column: 'ADC', description: 'Analog-to-Digital Converter reading' },
    { column: 'Temperature', description: 'Environmental temperature in Celsius (°C)' },
    { column: 'Humidity', description: 'Relative humidity percentage (0-100%)' },
    { column: 'VOC', description: 'Volatile Organic Compound names (e.g., p-Cresol, Dimethyl Sulfide)' },
    { column: 'Phase', description: 'Measurement phase (Pre-Puff (10 Mins) -> Puff (10 Mins) -> Sensor Turn Off (30 Mins))' }
  ];

  const vocData = {
    'p-Cresol': {
      name: 'p-Cresol',
      fullName: '4-Methylphenol',
      features: [
        'Molecular Weight: 108.14 g/mol',
        'Boiling Point: 201.9°C',
        'Melting Point: 35.5°C',
        'Detection Range: 0.1-50 ppm',
        'Response Time: < 30 seconds',
        'Sensitivity: High',
        'Selectivity: Good for phenolic compounds',
        'Interference: Low with other VOCs'
      ]
    },
    'Dimethyl Sulfide': {
      name: 'Dimethyl Sulfide',
      fullName: 'DMS (C2H6S)',
      features: [
        'Molecular Weight: 62.13 g/mol',
        'Boiling Point: 37.3°C',
        'Melting Point: -98.2°C',
        'Detection Range: 0.05-20 ppm',
        'Response Time: < 20 seconds',
        'Sensitivity: Very High',
        'Selectivity: Excellent for sulfur compounds',
        'Interference: Minimal with other VOCs'
      ]
    }
  };

  const WaitingForData = ({ sensorName, vocs }) => {
    const handleVOCClick = (vocName) => {
      setExpandedVOC(expandedVOC === vocName ? null : vocName);
    };

    return (
      <div style={styles.waitingCard}>
        <span style={styles.waitingIcon}>⏳</span>
        <h3 style={styles.waitingTitle}>Waiting for Lab Data</h3>
        <p style={styles.waitingDescription}>
          {sensorName} data will be available once lab testing is completed.
        </p>
        <div style={styles.vocList}>
          {vocs.map((voc, index) => (
            <div key={index}>
              <span 
                style={{
                  ...styles.vocItem,
                  ...(expandedVOC === voc ? styles.vocExpanded : {})
                }}
                onClick={() => handleVOCClick(voc)}
                onMouseEnter={(e) => {
                  if (expandedVOC !== voc) {
                    e.target.style.background = 'rgba(0, 200, 255, 0.4)';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.border = '1px solid rgba(0, 200, 255, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (expandedVOC !== voc) {
                    e.target.style.background = 'rgba(0, 200, 255, 0.2)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.border = '1px solid rgba(0, 200, 255, 0.3)';
                  }
                }}
              >
                {voc} {expandedVOC === voc ? '▼' : '▶'}
              </span>
              {expandedVOC === voc && vocData[voc] && (
                <div style={styles.vocFeatures}>
                  {/* Raw Data Section - CSV Viewer */}
                  <div style={styles.dataSection}>
                    <div style={styles.sectionTitle}>
                      📊 Raw Data - CSV Viewer
                      <span style={styles.waitingBadge}>Waiting for Lab Data</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '10px 0' }}>
                      CSV data will be displayed in a table format once lab testing begins.
                    </p>
                    
                    {/* CSV Table Placeholder */}
                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      overflow: 'hidden',
                      marginTop: '15px'
                    }}>
                      {/* Table Header */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        background: 'rgba(0, 200, 255, 0.2)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Date</div>
                        <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Time</div>
                        <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>ADC</div>
                        <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Temperature</div>
                        <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Humidity</div>
                        <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>VOC</div>
                        <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Phase</div>
                      </div>
                      
                      {/* Table Rows Placeholder */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{voc}</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{voc}</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{voc}</div>
                        <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>--</div>
                      </div>
                      
                      {/* More rows indicator */}
                      <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.8rem',
                        fontStyle: 'italic'
                      }}>
                        ... More data rows will appear here once lab testing begins
                      </div>
                    </div>
                  </div>

                  {/* Download Section */}
                  <div style={styles.dataSection}>
                    <div style={styles.sectionTitle}>
                      💾 Download
                      <span style={styles.waitingBadge}>Waiting for Lab Data</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '10px 0' }}>
                      CSV files will be available for download once data collection is complete.
                    </p>
                    <div style={styles.downloadButtons}>
                      <button style={styles.downloadButton} disabled>
                        📄 Raw Data CSV
                      </button>
                    </div>
                  </div>

                  {/* Analytics Section */}
                  <div style={styles.dataSection}>
                    <div style={styles.sectionTitle}>
                      📈 Analytics
                      <span style={styles.waitingBadge}>Waiting for Lab Data</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '10px 0' }}>
                      Analytics will be calculated from: Date, Time, ADC, Temperature, Humidity, VOC, Phase data.
                    </p>
                    
                    {/* Phase-Based Analytics */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600 }}>
                        📊 Phase Analysis
                      </h4>
                      <div style={styles.analyticsGrid}>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Baseline Stability</div>
                          <div style={styles.analyticsValue}>--%</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Exposure Response</div>
                          <div style={styles.analyticsValue}>--%</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Recovery Time</div>
                          <div style={styles.analyticsValue}>-- min</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Phase Transitions</div>
                          <div style={styles.analyticsValue}>--</div>
                        </div>
                      </div>
                    </div>

                    {/* ADC Signal Analytics */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600 }}>
                        ⚡ ADC Signal Analysis
                      </h4>
                      <div style={styles.analyticsGrid}>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Signal Range</div>
                          <div style={styles.analyticsValue}>-- to --</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Signal Variance</div>
                          <div style={styles.analyticsValue}>--%</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Noise Level</div>
                          <div style={styles.analyticsValue}>-- ADC</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Signal Drift</div>
                          <div style={styles.analyticsValue}>--%</div>
                        </div>
                      </div>
                    </div>

                    {/* Environmental Impact */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600 }}>
                        🌡️ Environmental Impact
                      </h4>
                      <div style={styles.analyticsGrid}>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Temp Correlation</div>
                          <div style={styles.analyticsValue}>--%</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Humidity Correlation</div>
                          <div style={styles.analyticsValue}>--%</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Environmental Drift</div>
                          <div style={styles.analyticsValue}>--%</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Compensation Factor</div>
                          <div style={styles.analyticsValue}>--</div>
                        </div>
                      </div>
                    </div>

                    {/* VOC Detection Performance */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600 }}>
                        🎯 VOC Detection Performance
                      </h4>
                      <div style={styles.analyticsGrid}>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Detection Accuracy</div>
                          <div style={styles.analyticsValue}>--%</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>False Positive Rate</div>
                          <div style={styles.analyticsValue}>--%</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>False Negative Rate</div>
                          <div style={styles.analyticsValue}>--%</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Detection Threshold</div>
                          <div style={styles.analyticsValue}>-- ADC</div>
                        </div>
                      </div>
                    </div>

                    {/* Temporal Analysis */}
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600 }}>
                        ⏰ Temporal Analysis
                      </h4>
                      <div style={styles.analyticsGrid}>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Response Time</div>
                          <div style={styles.analyticsValue}>-- sec</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Peak Detection Time</div>
                          <div style={styles.analyticsValue}>-- sec</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Data Quality Score</div>
                          <div style={styles.analyticsValue}>--/10</div>
                        </div>
                        <div style={styles.analyticsItem}>
                          <div style={styles.analyticsLabel}>Sampling Rate</div>
                          <div style={styles.analyticsValue}>-- Hz</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.pageContainer}>
      <button
        style={backButtonHover ? { ...styles.backButton, ...styles.backButtonHover } : styles.backButton}
        onClick={() => navigate('/options')}
        onMouseEnter={() => setBackButtonHover(true)}
        onMouseLeave={() => setBackButtonHover(false)}
      >
        ← Back to Options
      </button>
      
      <div style={styles.container}>
        <h2 style={styles.title}>🧬 Phase 3 Bio Lab Testing Dashboard</h2>
        
        {/* Navigation Tabs */}
        <div style={styles.navTabs}>
          <button
            style={activeTab === 'data-format' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('data-format')}
          >
            📊 Data Format
          </button>
          <button
            style={activeTab === 'bme688' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('bme688')}
          >
            🌡️ BME688 Data
          </button>
          <button
            style={activeTab === 'mq136' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('mq136')}
          >
            ⚗️ MQ136 Data
          </button>
          <button
            style={activeTab === 'mq138' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('mq138')}
          >
            🧪 MQ138 Data
          </button>
          <button
            style={activeTab === 'sgp40' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('sgp40')}
          >
            📡 SGP40 Data
          </button>
        </div>

        {/* Data Format Tab */}
        <div style={activeTab === 'data-format' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>
              📊 Data Format Specifications
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
              The following table explains the column structure for all sensor data files in Phase 3 Bio Lab Testing:
            </p>
            <table style={styles.dataFormatTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Column Name</th>
                  <th style={styles.tableHeader}>Description</th>
                </tr>
              </thead>
              <tbody>
                {dataFormatColumns.map((item, index) => (
                  <tr key={index}>
                    <td style={styles.tableCell}>
                      <strong>{item.column}</strong>
                    </td>
                    <td style={styles.tableCell}>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BME688 Data Tab */}
        <div style={activeTab === 'bme688' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>
              🌡️ BME688 Environmental & Gas Sensor Data
            </h3>
            <WaitingForData 
              sensorName="BME688 Environmental & Gas Sensor" 
              vocs={['p-Cresol', 'Dimethyl Sulfide']} 
            />
          </div>
        </div>

        {/* MQ136 Data Tab */}
        <div style={activeTab === 'mq136' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>
              ⚗️ MQ136 NH3 Sensor Data
            </h3>
            <WaitingForData 
              sensorName="MQ136 NH3 Sensor" 
              vocs={['p-Cresol', 'Dimethyl Sulfide']} 
            />
          </div>
        </div>

        {/* MQ138 Data Tab */}
        <div style={activeTab === 'mq138' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>
              🧪 MQ138 Alcohol/Benzene Sensor Data
            </h3>
            <WaitingForData 
              sensorName="MQ138 Alcohol/Benzene Sensor" 
              vocs={['p-Cresol', 'Dimethyl Sulfide']} 
            />
          </div>
        </div>

        {/* SGP40 Data Tab */}
        <div style={activeTab === 'sgp40' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>
              📡 SGP40 Digital VOC Sensor Data
            </h3>
            <WaitingForData 
              sensorName="SGP40 Digital VOC Sensor" 
              vocs={['p-Cresol', 'Dimethyl Sulfide']} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phase3BioDashboard;
