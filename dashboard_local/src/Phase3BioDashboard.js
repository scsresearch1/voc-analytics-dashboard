import React, { useState, useEffect } from 'react';
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
  const [sgp40Data, setSgp40Data] = useState(null);
  const [mq136Data, setMq136Data] = useState(null);
  const [loading, setLoading] = useState({ sgp40: false, mq136: false });
  const [error, setError] = useState({ sgp40: null, mq136: null });

  // Data loading functions
  const loadCSVData = async (filename, setData, setLoading, setError) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/Ph3_BioLab/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
      }
      
      const text = await response.text();
      if (text.includes('<html>') || text.includes('<!DOCTYPE')) {
        throw new Error(`Received HTML instead of CSV for ${filename}`);
      }
      
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',');
      const data = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        data.push(row);
      }
      
      setData(data);
      setLoading(false);
    } catch (err) {
      console.error(`Error loading ${filename}:`, err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Correlation calculation function
  const calculateCorrelation = (x, y) => {
    if (x.length !== y.length || x.length === 0) return 0;
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Load data when component mounts
  useEffect(() => {
    loadCSVData('SGP40_23Sep_p-Cresol_Round1.csv', setSgp40Data, 
      (loading) => setLoading(prev => ({ ...prev, sgp40: loading })), 
      (error) => setError(prev => ({ ...prev, sgp40: error }))
    );
    loadCSVData('MQ136_23Sep_p-Cresol_Round1.csv', setMq136Data, 
      (loading) => setLoading(prev => ({ ...prev, mq136: loading })), 
      (error) => setError(prev => ({ ...prev, mq136: error }))
    );
  }, []);

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

  // Real Data Display Component
  const RealDataDisplay = ({ sensorName, data, loading, error, vocs }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;

    if (loading) {
      return (
        <div style={styles.waitingCard}>
          <span style={styles.waitingIcon}>⏳</span>
          <h3 style={styles.waitingTitle}>Loading Data...</h3>
          <p style={styles.waitingDescription}>
            Loading {sensorName} data from lab testing files.
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={styles.waitingCard}>
          <span style={styles.waitingIcon}>❌</span>
          <h3 style={styles.waitingTitle}>Error Loading Data</h3>
          <p style={styles.waitingDescription}>
            {error}
          </p>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div style={styles.waitingCard}>
          <span style={styles.waitingIcon}>📊</span>
          <h3 style={styles.waitingTitle}>No Data Available</h3>
          <p style={styles.waitingDescription}>
            No {sensorName} data found in the lab testing files.
          </p>
        </div>
      );
    }

    // Calculate pagination
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    // Calculate statistics
    const adcValues = data.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val));
    const tempValues = data.map(row => parseFloat(row.Temp_C)).filter(val => !isNaN(val));
    const humidityValues = data.map(row => parseFloat(row.Humidity_pct)).filter(val => !isNaN(val));
    const voltageValues = data.map(row => parseFloat(row.Voltage_V)).filter(val => !isNaN(val));

    const stats = {
      adc: {
        min: Math.min(...adcValues),
        max: Math.max(...adcValues),
        mean: adcValues.reduce((a, b) => a + b, 0) / adcValues.length
      },
      temp: {
        min: Math.min(...tempValues),
        max: Math.max(...tempValues),
        mean: tempValues.reduce((a, b) => a + b, 0) / tempValues.length
      },
      humidity: {
        min: Math.min(...humidityValues),
        max: Math.max(...humidityValues),
        mean: humidityValues.reduce((a, b) => a + b, 0) / humidityValues.length
      },
      voltage: {
        min: Math.min(...voltageValues),
        max: Math.max(...voltageValues),
        mean: voltageValues.reduce((a, b) => a + b, 0) / voltageValues.length
      }
    };

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    return (
      <div>
        {/* Data Statistics */}
        <div style={styles.dataSection}>
          <div style={styles.sectionTitle}>
            📊 Data Statistics
          </div>
          <div style={styles.analyticsGrid}>
            <div style={styles.analyticsItem}>
              <div style={styles.analyticsLabel}>Total Records</div>
              <div style={styles.analyticsValue}>{data.length}</div>
            </div>
            <div style={styles.analyticsItem}>
              <div style={styles.analyticsLabel}>ADC Range</div>
              <div style={styles.analyticsValue}>{stats.adc.min.toFixed(0)} - {stats.adc.max.toFixed(0)}</div>
            </div>
            <div style={styles.analyticsItem}>
              <div style={styles.analyticsLabel}>Temperature Range</div>
              <div style={styles.analyticsValue}>{stats.temp.min.toFixed(1)}°C - {stats.temp.max.toFixed(1)}°C</div>
            </div>
            <div style={styles.analyticsItem}>
              <div style={styles.analyticsLabel}>Humidity Range</div>
              <div style={styles.analyticsValue}>{stats.humidity.min.toFixed(1)}% - {stats.humidity.max.toFixed(1)}%</div>
            </div>
            <div style={styles.analyticsItem}>
              <div style={styles.analyticsLabel}>Voltage Range</div>
              <div style={styles.analyticsValue}>{stats.voltage.min.toFixed(2)}V - {stats.voltage.max.toFixed(2)}V</div>
            </div>
          </div>
        </div>

        {/* Raw Data Table */}
        <div style={styles.dataSection}>
          <div style={styles.sectionTitle}>
            📋 Raw Data - CSV Viewer
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '10px 0' }}>
            Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} records
          </p>
          
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
              gridTemplateColumns: 'repeat(8, 1fr)',
              background: 'rgba(0, 200, 255, 0.2)',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>SNO</div>
              <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Date</div>
              <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Time</div>
              <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>ADC</div>
              <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Temp_C</div>
              <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Humidity_pct</div>
              <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Phase</div>
              <div style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>Voltage_V</div>
            </div>
            
            {/* Table Rows */}
            {currentData.map((row, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{row.SNO}</div>
                <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{row.Date}</div>
                <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{row.Time}</div>
                <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{row.ADC}</div>
                <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{row.Temp_C}</div>
                <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{row.Humidity_pct}</div>
                <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{row.Phase}</div>
                <div style={{ padding: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{row.Voltage_V}</div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            marginTop: '20px'
          }}>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: currentPage === 1 ? 'rgba(255,255,255,0.1)' : 'rgba(0, 200, 255, 0.2)',
                color: currentPage === 1 ? 'rgba(255,255,255,0.4)' : '#fff',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: currentPage === 1 ? 'rgba(255,255,255,0.1)' : 'rgba(0, 200, 255, 0.2)',
                color: currentPage === 1 ? 'rgba(255,255,255,0.4)' : '#fff',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : 'rgba(0, 200, 255, 0.2)',
                color: currentPage === totalPages ? 'rgba(255,255,255,0.4)' : '#fff',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : 'rgba(0, 200, 255, 0.2)',
                color: currentPage === totalPages ? 'rgba(255,255,255,0.4)' : '#fff',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>

        {/* Data Visualization Section */}
        <div style={styles.dataSection}>
          <div style={styles.sectionTitle}>
            📊 Data Visualization
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '10px 0' }}>
            Interactive line graphs showing sensor data trends over time.
          </p>
          
          {/* ADC Line Graph */}
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '15px', fontWeight: 600 }}>
              ⚡ ADC Signal Over Time
            </h4>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              height: '300px',
              position: 'relative'
            }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                {(() => {
                  const width = 800;
                  const height = 250;
                  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
                  const chartWidth = width - margin.left - margin.right;
                  const chartHeight = height - margin.top - margin.bottom;
                  
                  const adcValues = data.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val));
                  if (adcValues.length === 0) return null;
                  
                  const minADC = Math.min(...adcValues);
                  const maxADC = Math.max(...adcValues);
                  const adcRange = maxADC - minADC;
                  const padding = adcRange * 0.1;
                  
                  const xScale = (i) => margin.left + (i / (adcValues.length - 1)) * chartWidth;
                  const yScale = (value) => margin.top + chartHeight - ((value - minADC + padding) / (adcRange + 2 * padding)) * chartHeight;
                  
                  const points = adcValues.map((value, i) => `${xScale(i)},${yScale(value)}`).join(' ');
                  
                  // Calculate phase boundaries
                  const phases = data.map(row => row.Phase);
                  const phaseChanges = [];
                  let currentPhase = phases[0];
                  
                  for (let i = 1; i < phases.length; i++) {
                    if (phases[i] !== currentPhase) {
                      phaseChanges.push({ index: i, phase: phases[i], prevPhase: currentPhase });
                      currentPhase = phases[i];
                    }
                  }
                  
                  return (
                    <g>
                      {/* Phase Backgrounds (Swim Lanes) */}
                      {(() => {
                        const phaseRanges = [];
                        let currentPhase = phases[0];
                        let startIndex = 0;
                        
                        for (let i = 1; i < phases.length; i++) {
                          if (phases[i] !== currentPhase) {
                            phaseRanges.push({
                              phase: currentPhase,
                              start: startIndex,
                              end: i - 1,
                              x1: xScale(startIndex),
                              x2: xScale(i - 1)
                            });
                            startIndex = i;
                            currentPhase = phases[i];
                          }
                        }
                        // Add the last phase
                        phaseRanges.push({
                          phase: currentPhase,
                          start: startIndex,
                          end: phases.length - 1,
                          x1: xScale(startIndex),
                          x2: xScale(phases.length - 1)
                        });
                        
                        return phaseRanges.map((range, index) => {
                          const phaseColors = {
                            'Pre_Puff': 'rgba(0, 200, 255, 0.1)',
                            'Puff': 'rgba(255, 107, 107, 0.1)',
                            'Post_Puff': 'rgba(78, 205, 196, 0.1)'
                          };
                          
                          return (
                            <g key={index}>
                              {/* Phase background */}
                              <rect
                                x={range.x1}
                                y={margin.top}
                                width={range.x2 - range.x1}
                                height={chartHeight}
                                fill={phaseColors[range.phase] || 'rgba(255,255,255,0.05)'}
                                opacity="0.3"
                              />
                              {/* Phase label */}
                              <text
                                x={range.x1 + (range.x2 - range.x1) / 2}
                                y={margin.top + 15}
                                fill="rgba(255,255,255,0.8)"
                                fontSize="12"
                                fontWeight="600"
                                textAnchor="middle"
                              >
                                {range.phase.replace('_', ' ')}
                              </text>
                            </g>
                          );
                        });
                      })()}
                      
                      {/* Phase Boundary Lines */}
                      {phaseChanges.map((change, index) => (
                        <line
                          key={index}
                          x1={xScale(change.index)}
                          y1={margin.top}
                          x2={xScale(change.index)}
                          y2={margin.top + chartHeight}
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      ))}
                      
                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                        <g key={ratio}>
                          <line
                            x1={margin.left}
                            y1={margin.top + ratio * chartHeight}
                            x2={margin.left + chartWidth}
                            y2={margin.top + ratio * chartHeight}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                          />
                          <text
                            x={margin.left - 10}
                            y={margin.top + ratio * chartHeight + 5}
                            fill="rgba(255,255,255,0.6)"
                            fontSize="12"
                            textAnchor="end"
                          >
                            {(minADC + padding + (1 - ratio) * (adcRange + 2 * padding)).toFixed(0)}
                          </text>
                        </g>
                      ))}
                      
                      {/* Line graph */}
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#00c8ff"
                        strokeWidth="2"
                      />
                      
                      {/* Data points */}
                      {adcValues.map((value, i) => (
                        <circle
                          key={i}
                          cx={xScale(i)}
                          cy={yScale(value)}
                          r="3"
                          fill="#00c8ff"
                          opacity="0.8"
                        />
                      ))}
                      
                      {/* Axes */}
                      <line
                        x1={margin.left}
                        y1={margin.top}
                        x2={margin.left}
                        y2={margin.top + chartHeight}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      <line
                        x1={margin.left}
                        y1={margin.top + chartHeight}
                        x2={margin.left + chartWidth}
                        y2={margin.top + chartHeight}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      
                      {/* Labels */}
                      <text
                        x={margin.left + chartWidth / 2}
                        y={height - 5}
                        fill="rgba(255,255,255,0.8)"
                        fontSize="14"
                        textAnchor="middle"
                      >
                        Data Points
                      </text>
                      <text
                        x={10}
                        y={margin.top + chartHeight / 2}
                        fill="rgba(255,255,255,0.8)"
                        fontSize="14"
                        textAnchor="middle"
                        transform={`rotate(-90, 10, ${margin.top + chartHeight / 2})`}
                      >
                        ADC Value
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Temperature Line Graph */}
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '15px', fontWeight: 600 }}>
              🌡️ Temperature Over Time
            </h4>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              height: '300px',
              position: 'relative'
            }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                {(() => {
                  const width = 800;
                  const height = 250;
                  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
                  const chartWidth = width - margin.left - margin.right;
                  const chartHeight = height - margin.top - margin.bottom;
                  
                  const tempValues = data.map(row => parseFloat(row.Temp_C)).filter(val => !isNaN(val));
                  if (tempValues.length === 0) return null;
                  
                  const minTemp = Math.min(...tempValues);
                  const maxTemp = Math.max(...tempValues);
                  const tempRange = maxTemp - minTemp;
                  const padding = tempRange * 0.1;
                  
                  const xScale = (i) => margin.left + (i / (tempValues.length - 1)) * chartWidth;
                  const yScale = (value) => margin.top + chartHeight - ((value - minTemp + padding) / (tempRange + 2 * padding)) * chartHeight;
                  
                  const points = tempValues.map((value, i) => `${xScale(i)},${yScale(value)}`).join(' ');
                  
                  // Calculate phase boundaries
                  const phases = data.map(row => row.Phase);
                  const phaseChanges = [];
                  let currentPhase = phases[0];
                  
                  for (let i = 1; i < phases.length; i++) {
                    if (phases[i] !== currentPhase) {
                      phaseChanges.push({ index: i, phase: phases[i], prevPhase: currentPhase });
                      currentPhase = phases[i];
                    }
                  }
                  
                  return (
                    <g>
                      {/* Phase Backgrounds (Swim Lanes) */}
                      {(() => {
                        const phaseRanges = [];
                        let currentPhase = phases[0];
                        let startIndex = 0;
                        
                        for (let i = 1; i < phases.length; i++) {
                          if (phases[i] !== currentPhase) {
                            phaseRanges.push({
                              phase: currentPhase,
                              start: startIndex,
                              end: i - 1,
                              x1: xScale(startIndex),
                              x2: xScale(i - 1)
                            });
                            startIndex = i;
                            currentPhase = phases[i];
                          }
                        }
                        // Add the last phase
                        phaseRanges.push({
                          phase: currentPhase,
                          start: startIndex,
                          end: phases.length - 1,
                          x1: xScale(startIndex),
                          x2: xScale(phases.length - 1)
                        });
                        
                        return phaseRanges.map((range, index) => {
                          const phaseColors = {
                            'Pre_Puff': 'rgba(0, 200, 255, 0.1)',
                            'Puff': 'rgba(255, 107, 107, 0.1)',
                            'Post_Puff': 'rgba(78, 205, 196, 0.1)'
                          };
                          
                          return (
                            <g key={index}>
                              {/* Phase background */}
                              <rect
                                x={range.x1}
                                y={margin.top}
                                width={range.x2 - range.x1}
                                height={chartHeight}
                                fill={phaseColors[range.phase] || 'rgba(255,255,255,0.05)'}
                                opacity="0.3"
                              />
                              {/* Phase label */}
                              <text
                                x={range.x1 + (range.x2 - range.x1) / 2}
                                y={margin.top + 15}
                                fill="rgba(255,255,255,0.8)"
                                fontSize="12"
                                fontWeight="600"
                                textAnchor="middle"
                              >
                                {range.phase.replace('_', ' ')}
                              </text>
                            </g>
                          );
                        });
                      })()}
                      
                      {/* Phase Boundary Lines */}
                      {phaseChanges.map((change, index) => (
                        <line
                          key={index}
                          x1={xScale(change.index)}
                          y1={margin.top}
                          x2={xScale(change.index)}
                          y2={margin.top + chartHeight}
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      ))}
                      
                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                        <g key={ratio}>
                          <line
                            x1={margin.left}
                            y1={margin.top + ratio * chartHeight}
                            x2={margin.left + chartWidth}
                            y2={margin.top + ratio * chartHeight}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                          />
                          <text
                            x={margin.left - 10}
                            y={margin.top + ratio * chartHeight + 5}
                            fill="rgba(255,255,255,0.6)"
                            fontSize="12"
                            textAnchor="end"
                          >
                            {(minTemp + padding + (1 - ratio) * (tempRange + 2 * padding)).toFixed(1)}°C
                          </text>
                        </g>
                      ))}
                      
                      {/* Line graph */}
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#ff6b6b"
                        strokeWidth="2"
                      />
                      
                      {/* Data points */}
                      {tempValues.map((value, i) => (
                        <circle
                          key={i}
                          cx={xScale(i)}
                          cy={yScale(value)}
                          r="3"
                          fill="#ff6b6b"
                          opacity="0.8"
                        />
                      ))}
                      
                      {/* Axes */}
                      <line
                        x1={margin.left}
                        y1={margin.top}
                        x2={margin.left}
                        y2={margin.top + chartHeight}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      <line
                        x1={margin.left}
                        y1={margin.top + chartHeight}
                        x2={margin.left + chartWidth}
                        y2={margin.top + chartHeight}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      
                      {/* Labels */}
                      <text
                        x={margin.left + chartWidth / 2}
                        y={height - 5}
                        fill="rgba(255,255,255,0.8)"
                        fontSize="14"
                        textAnchor="middle"
                      >
                        Data Points
                      </text>
                      <text
                        x={10}
                        y={margin.top + chartHeight / 2}
                        fill="rgba(255,255,255,0.8)"
                        fontSize="14"
                        textAnchor="middle"
                        transform={`rotate(-90, 10, ${margin.top + chartHeight / 2})`}
                      >
                        Temperature (°C)
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Humidity Line Graph */}
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '15px', fontWeight: 600 }}>
              💧 Humidity Over Time
            </h4>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              height: '300px',
              position: 'relative'
            }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                {(() => {
                  const width = 800;
                  const height = 250;
                  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
                  const chartWidth = width - margin.left - margin.right;
                  const chartHeight = height - margin.top - margin.bottom;
                  
                  const humidityValues = data.map(row => parseFloat(row.Humidity_pct)).filter(val => !isNaN(val));
                  if (humidityValues.length === 0) return null;
                  
                  const minHumidity = Math.min(...humidityValues);
                  const maxHumidity = Math.max(...humidityValues);
                  const humidityRange = maxHumidity - minHumidity;
                  const padding = humidityRange * 0.1;
                  
                  const xScale = (i) => margin.left + (i / (humidityValues.length - 1)) * chartWidth;
                  const yScale = (value) => margin.top + chartHeight - ((value - minHumidity + padding) / (humidityRange + 2 * padding)) * chartHeight;
                  
                  const points = humidityValues.map((value, i) => `${xScale(i)},${yScale(value)}`).join(' ');
                  
                  // Calculate phase boundaries
                  const phases = data.map(row => row.Phase);
                  const phaseChanges = [];
                  let currentPhase = phases[0];
                  
                  for (let i = 1; i < phases.length; i++) {
                    if (phases[i] !== currentPhase) {
                      phaseChanges.push({ index: i, phase: phases[i], prevPhase: currentPhase });
                      currentPhase = phases[i];
                    }
                  }
                  
                  return (
                    <g>
                      {/* Phase Backgrounds (Swim Lanes) */}
                      {(() => {
                        const phaseRanges = [];
                        let currentPhase = phases[0];
                        let startIndex = 0;
                        
                        for (let i = 1; i < phases.length; i++) {
                          if (phases[i] !== currentPhase) {
                            phaseRanges.push({
                              phase: currentPhase,
                              start: startIndex,
                              end: i - 1,
                              x1: xScale(startIndex),
                              x2: xScale(i - 1)
                            });
                            startIndex = i;
                            currentPhase = phases[i];
                          }
                        }
                        // Add the last phase
                        phaseRanges.push({
                          phase: currentPhase,
                          start: startIndex,
                          end: phases.length - 1,
                          x1: xScale(startIndex),
                          x2: xScale(phases.length - 1)
                        });
                        
                        return phaseRanges.map((range, index) => {
                          const phaseColors = {
                            'Pre_Puff': 'rgba(0, 200, 255, 0.1)',
                            'Puff': 'rgba(255, 107, 107, 0.1)',
                            'Post_Puff': 'rgba(78, 205, 196, 0.1)'
                          };
                          
                          return (
                            <g key={index}>
                              {/* Phase background */}
                              <rect
                                x={range.x1}
                                y={margin.top}
                                width={range.x2 - range.x1}
                                height={chartHeight}
                                fill={phaseColors[range.phase] || 'rgba(255,255,255,0.05)'}
                                opacity="0.3"
                              />
                              {/* Phase label */}
                              <text
                                x={range.x1 + (range.x2 - range.x1) / 2}
                                y={margin.top + 15}
                                fill="rgba(255,255,255,0.8)"
                                fontSize="12"
                                fontWeight="600"
                                textAnchor="middle"
                              >
                                {range.phase.replace('_', ' ')}
                              </text>
                            </g>
                          );
                        });
                      })()}
                      
                      {/* Phase Boundary Lines */}
                      {phaseChanges.map((change, index) => (
                        <line
                          key={index}
                          x1={xScale(change.index)}
                          y1={margin.top}
                          x2={xScale(change.index)}
                          y2={margin.top + chartHeight}
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      ))}
                      
                      {/* Grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                        <g key={ratio}>
                          <line
                            x1={margin.left}
                            y1={margin.top + ratio * chartHeight}
                            x2={margin.left + chartWidth}
                            y2={margin.top + ratio * chartHeight}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                          />
                          <text
                            x={margin.left - 10}
                            y={margin.top + ratio * chartHeight + 5}
                            fill="rgba(255,255,255,0.6)"
                            fontSize="12"
                            textAnchor="end"
                          >
                            {(minHumidity + padding + (1 - ratio) * (humidityRange + 2 * padding)).toFixed(1)}%
                          </text>
                        </g>
                      ))}
                      
                      {/* Line graph */}
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#4ecdc4"
                        strokeWidth="2"
                      />
                      
                      {/* Data points */}
                      {humidityValues.map((value, i) => (
                        <circle
                          key={i}
                          cx={xScale(i)}
                          cy={yScale(value)}
                          r="3"
                          fill="#4ecdc4"
                          opacity="0.8"
                        />
                      ))}
                      
                      {/* Axes */}
                      <line
                        x1={margin.left}
                        y1={margin.top}
                        x2={margin.left}
                        y2={margin.top + chartHeight}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      <line
                        x1={margin.left}
                        y1={margin.top + chartHeight}
                        x2={margin.left + chartWidth}
                        y2={margin.top + chartHeight}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      
                      {/* Labels */}
                      <text
                        x={margin.left + chartWidth / 2}
                        y={height - 5}
                        fill="rgba(255,255,255,0.8)"
                        fontSize="14"
                        textAnchor="middle"
                      >
                        Data Points
                      </text>
                      <text
                        x={10}
                        y={margin.top + chartHeight / 2}
                        fill="rgba(255,255,255,0.8)"
                        fontSize="14"
                        textAnchor="middle"
                        transform={`rotate(-90, 10, ${margin.top + chartHeight / 2})`}
                      >
                        Humidity (%)
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div style={styles.dataSection}>
          <div style={styles.sectionTitle}>
            📈 Analytics
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '10px 0' }}>
            Analytics calculated from: Date, Time, ADC, Temperature, Humidity, VOC, Phase data.
          </p>
          
          {/* Phase-Based Analytics */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 600 }}>
              📊 Phase Analysis
            </h4>
            <div style={styles.analyticsGrid}>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Baseline Stability</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const prePuffData = data.filter(row => row.Phase === 'Pre_Puff');
                    if (prePuffData.length === 0) return '--%';
                    const adcValues = prePuffData.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val));
                    if (adcValues.length === 0) return '--%';
                    const mean = adcValues.reduce((a, b) => a + b, 0) / adcValues.length;
                    const variance = adcValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / adcValues.length;
                    const stability = Math.max(0, 100 - (Math.sqrt(variance) / mean * 100));
                    return `${stability.toFixed(1)}%`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Exposure Response</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const prePuffData = data.filter(row => row.Phase === 'Pre_Puff');
                    const puffData = data.filter(row => row.Phase === 'Puff');
                    if (prePuffData.length === 0 || puffData.length === 0) return '--%';
                    const prePuffMean = prePuffData.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val)).reduce((a, b) => a + b, 0) / prePuffData.length;
                    const puffMean = puffData.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val)).reduce((a, b) => a + b, 0) / puffData.length;
                    const response = ((puffMean - prePuffMean) / prePuffMean * 100);
                    return `${response.toFixed(1)}%`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Recovery Time</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const postPuffData = data.filter(row => row.Phase === 'Post_Puff');
                    if (postPuffData.length === 0) return '-- min';
                    const timeDiff = postPuffData.length * 0.1; // Assuming 0.1 min per record
                    return `${timeDiff.toFixed(1)} min`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Phase Transitions</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const phases = [...new Set(data.map(row => row.Phase))];
                    return phases.length;
                  })()}
                </div>
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
                <div style={styles.analyticsValue}>{stats.adc.min.toFixed(0)} to {stats.adc.max.toFixed(0)}</div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Signal Variance</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const variance = adcValues.reduce((sum, val) => sum + Math.pow(val - stats.adc.mean, 2), 0) / adcValues.length;
                    const cv = (Math.sqrt(variance) / stats.adc.mean * 100);
                    return `${cv.toFixed(1)}%`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Noise Level</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const sortedValues = [...adcValues].sort((a, b) => a - b);
                    const q1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
                    const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
                    const iqr = q3 - q1;
                    return `${iqr.toFixed(0)} ADC`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Signal Drift</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const firstHalf = adcValues.slice(0, Math.floor(adcValues.length / 2));
                    const secondHalf = adcValues.slice(Math.floor(adcValues.length / 2));
                    const firstMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
                    const secondMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
                    const drift = ((secondMean - firstMean) / firstMean * 100);
                    return `${drift.toFixed(1)}%`;
                  })()}
                </div>
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
                <div style={styles.analyticsValue}>
                  {(() => {
                    const correlation = calculateCorrelation(adcValues, tempValues);
                    return `${(correlation * 100).toFixed(1)}%`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Humidity Correlation</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const correlation = calculateCorrelation(adcValues, humidityValues);
                    return `${(correlation * 100).toFixed(1)}%`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Environmental Drift</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const tempRange = stats.temp.max - stats.temp.min;
                    const humidityRange = stats.humidity.max - stats.humidity.min;
                    const envDrift = ((tempRange + humidityRange) / 2);
                    return `${envDrift.toFixed(1)}%`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Compensation Factor</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const tempCorr = Math.abs(calculateCorrelation(adcValues, tempValues));
                    const humidityCorr = Math.abs(calculateCorrelation(adcValues, humidityValues));
                    const compensation = (tempCorr + humidityCorr) / 2;
                    return compensation.toFixed(2);
                  })()}
                </div>
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
                <div style={styles.analyticsValue}>
                  {(() => {
                    const puffData = data.filter(row => row.Phase === 'Puff');
                    const prePuffData = data.filter(row => row.Phase === 'Pre_Puff');
                    if (puffData.length === 0 || prePuffData.length === 0) return '--%';
                    const puffMean = puffData.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val)).reduce((a, b) => a + b, 0) / puffData.length;
                    const prePuffMean = prePuffData.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val)).reduce((a, b) => a + b, 0) / prePuffData.length;
                    const accuracy = Math.min(100, Math.max(0, ((puffMean - prePuffMean) / prePuffMean * 100) + 50));
                    return `${accuracy.toFixed(1)}%`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>False Positive Rate</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const prePuffData = data.filter(row => row.Phase === 'Pre_Puff');
                    if (prePuffData.length === 0) return '--%';
                    const variance = prePuffData.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val));
                    const mean = variance.reduce((a, b) => a + b, 0) / variance.length;
                    const stdDev = Math.sqrt(variance.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / variance.length);
                    const threshold = mean + (2 * stdDev);
                    const falsePositives = variance.filter(val => val > threshold).length;
                    return `${(falsePositives / variance.length * 100).toFixed(1)}%`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>False Negative Rate</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const puffData = data.filter(row => row.Phase === 'Puff');
                    if (puffData.length === 0) return '--%';
                    const variance = puffData.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val));
                    const mean = variance.reduce((a, b) => a + b, 0) / variance.length;
                    const stdDev = Math.sqrt(variance.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / variance.length);
                    const threshold = mean - (2 * stdDev);
                    const falseNegatives = variance.filter(val => val < threshold).length;
                    return `${(falseNegatives / variance.length * 100).toFixed(1)}%`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Detection Threshold</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const prePuffData = data.filter(row => row.Phase === 'Pre_Puff');
                    if (prePuffData.length === 0) return '-- ADC';
                    const values = prePuffData.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val));
                    const mean = values.reduce((a, b) => a + b, 0) / values.length;
                    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
                    const threshold = mean + (3 * stdDev);
                    return `${threshold.toFixed(0)} ADC`;
                  })()}
                </div>
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
                <div style={styles.analyticsValue}>
                  {(() => {
                    const puffData = data.filter(row => row.Phase === 'Puff');
                    if (puffData.length === 0) return '-- sec';
                    const responseTime = puffData.length * 0.1; // Assuming 0.1 sec per record
                    return `${responseTime.toFixed(1)} sec`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Peak Detection Time</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const puffData = data.filter(row => row.Phase === 'Puff');
                    if (puffData.length === 0) return '-- sec';
                    const adcValues = puffData.map(row => parseFloat(row.ADC)).filter(val => !isNaN(val));
                    const maxIndex = adcValues.indexOf(Math.max(...adcValues));
                    const peakTime = maxIndex * 0.1; // Assuming 0.1 sec per record
                    return `${peakTime.toFixed(1)} sec`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Data Quality Score*</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const completeness = (data.length / data.length) * 100;
                    const consistency = 100 - (stats.adc.max - stats.adc.min) / stats.adc.mean * 10;
                    const quality = Math.min(10, Math.max(0, (completeness + consistency) / 20));
                    return `${quality.toFixed(1)}/10`;
                  })()}
                </div>
              </div>
              <div style={styles.analyticsItem}>
                <div style={styles.analyticsLabel}>Sampling Rate</div>
                <div style={styles.analyticsValue}>
                  {(() => {
                    const timeSpan = data.length * 0.1; // Assuming 0.1 sec per record
                    const samplingRate = data.length / timeSpan;
                    return `${samplingRate.toFixed(1)} Hz`;
                  })()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Quality Score Explanation */}
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '8px', 
            border: '1px solid rgba(255,255,255,0.1)' 
          }}>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '0.85rem', 
              margin: '0',
              lineHeight: '1.4'
            }}>
              <strong style={{ color: '#fff' }}>*Data Quality Score Calculation:</strong><br/>
              The score combines two factors: <strong>Completeness</strong> (100% for complete datasets) and <strong>Consistency</strong> 
              (based on ADC signal stability). Formula: ((Completeness + Consistency) / 20), where Consistency = 100 - 
              ((ADC Range / ADC Mean) × 10). Higher scores indicate better data quality with more stable, complete measurements.
            </p>
          </div>
        </div>

        {/* Download Section */}
        <div style={styles.dataSection}>
          <div style={styles.sectionTitle}>
            💾 Download Data
          </div>
          <div style={styles.downloadButtons}>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 200, 255, 0.3)',
                background: 'rgba(0, 200, 255, 0.2)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                const csvContent = [
                  'SNO,Date,Time,ADC,Temp_C,Humidity_pct,VOC,Phase,Voltage_V',
                  ...data.map(row => 
                    `${row.SNO},${row.Date},${row.Time},${row.ADC},${row.Temp_C},${row.Humidity_pct},${row.VOC},${row.Phase},${row.Voltage_V}`
                  )
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${sensorName.replace(/\s+/g, '_')}_Data.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              📄 Download CSV
            </button>
          </div>
        </div>
      </div>
    );
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
            {mq136Data ? (
              <div>
                <div style={styles.vocList}>
                  {['p-Cresol'].map((voc, index) => (
                    <div key={index}>
                      <span 
                        style={{
                          ...styles.vocItem,
                          ...(expandedVOC === voc ? styles.vocExpanded : {})
                        }}
                        onClick={() => setExpandedVOC(expandedVOC === voc ? null : voc)}
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
                      {expandedVOC === voc && (
                        <div style={styles.vocFeatures}>
                          <RealDataDisplay 
                            sensorName="MQ136 NH3 Sensor" 
                            data={mq136Data}
                            loading={loading.mq136}
                            error={error.mq136}
                            vocs={['p-Cresol']} 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <WaitingForData 
                sensorName="MQ136 NH3 Sensor" 
                vocs={['p-Cresol', 'Dimethyl Sulfide']} 
              />
            )}
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
            {sgp40Data ? (
              <div>
                <div style={styles.vocList}>
                  {['p-Cresol'].map((voc, index) => (
                    <div key={index}>
                      <span 
                        style={{
                          ...styles.vocItem,
                          ...(expandedVOC === voc ? styles.vocExpanded : {})
                        }}
                        onClick={() => setExpandedVOC(expandedVOC === voc ? null : voc)}
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
                      {expandedVOC === voc && (
                        <div style={styles.vocFeatures}>
                          <RealDataDisplay 
                            sensorName="SGP40 Digital VOC Sensor" 
                            data={sgp40Data}
                            loading={loading.sgp40}
                            error={error.sgp40}
                            vocs={['p-Cresol']} 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <WaitingForData 
                sensorName="SGP40 Digital VOC Sensor" 
                vocs={['p-Cresol', 'Dimethyl Sulfide']} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phase3BioDashboard;
