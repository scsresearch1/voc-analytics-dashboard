import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '0 20px',
  },
  title: {
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: 800,
    margin: 0,
    textShadow: '0 2px 8px rgba(0,0,0,0.10)',
  },
  backButton: {
    padding: '12px 24px',
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
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  tab: {
    padding: '12px 24px',
    borderRadius: '25px',
    border: '2px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    minWidth: '120px',
    textAlign: 'center',
  },
  activeTab: {
    background: 'rgba(255,255,255,0.25)',
    border: '2px solid rgba(255,255,255,0.6)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  contentContainer: {
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(12px)',
    border: '1.5px solid rgba(255,255,255,0.25)',
    padding: '30px',
    margin: '0 20px',
    minHeight: '500px',
  },
  contentTitle: {
    color: '#fff',
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: '20px',
    textAlign: 'center',
  },
  contentDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    textAlign: 'center',
    marginBottom: '30px',
  },
  dataGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  dataCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    textAlign: 'center',
  },
  dataCardTitle: {
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '10px',
  },
  dataCardValue: {
    color: '#ffd700',
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '5px',
  },
  dataCardLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.9rem',
  },
  comingSoon: {
    color: '#ffd700',
    fontSize: '1.5rem',
    fontWeight: 600,
    textAlign: 'center',
    marginTop: '50px',
    fontStyle: 'italic',
  },
  optionContent: {
    marginTop: '30px',
  },
  optionTitle: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '15px',
  },
  csvViewer: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  csvControls: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  downloadButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(76, 175, 80, 0.8)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  refreshButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(33, 150, 243, 0.8)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  debugButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255, 152, 0, 0.8)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  csvPreview: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    padding: '15px',
    overflow: 'auto',
    maxHeight: '400px',
  },
  csvHeader: {
    color: '#ffd700',
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '10px',
  },
  csvTable: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '1px',
    background: 'rgba(255,255,255,0.1)',
  },
  csvRow: {
    display: 'contents',
  },
  csvCell: {
    background: 'rgba(255,255,255,0.1)',
    padding: '8px 12px',
    color: '#fff',
    fontSize: '0.9rem',
    border: '1px solid rgba(255,255,255,0.2)',
    textAlign: 'center',
  },
  graphContainer: {
    marginTop: '20px',
  },
  graphGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  graphCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    textAlign: 'center',
  },
  graphTitle: {
    color: '#fff',
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '15px',
  },
  graphPlaceholder: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    padding: '40px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '1.1rem',
    border: '2px dashed rgba(255,255,255,0.3)',
  },
  exportContainer: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  exportOptions: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  exportButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(156, 39, 176, 0.8)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  exportInfo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
  loadingMessage: {
    color: '#ffd700',
    fontSize: '1.2rem',
    textAlign: 'center',
    padding: '40px',
    fontStyle: 'italic',
  },
  errorMessage: {
    color: '#f44336',
    fontSize: '1.1rem',
    textAlign: 'center',
    padding: '40px',
    background: 'rgba(244, 67, 54, 0.1)',
    borderRadius: '10px',
    border: '1px solid rgba(244, 67, 54, 0.3)',
  },
  lineGraph: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    padding: '10px',
    marginTop: '10px',
  },
  barGraph: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    padding: '10px',
    marginTop: '10px',
  },
  bellCurve: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    padding: '10px',
    marginTop: '10px',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '10px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#fff',
    fontSize: '0.9rem',
  },
  legendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
  },
  sampleDataNotice: {
    color: '#ffd700',
    fontSize: '1rem',
    textAlign: 'center',
    padding: '15px',
    background: 'rgba(255, 215, 0, 0.1)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    marginTop: '20px',
  },
  graphGridLarge: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '30px',
    marginTop: '20px',
  },
  largeGraphCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '25px',
    border: '1px solid rgba(255,255,255,0.2)',
    textAlign: 'center',
  },
  interactiveGraph: {
    position: 'relative',
    cursor: 'crosshair',
    userSelect: 'none',
  },
  dataPoint: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tooltip: {
    position: 'absolute',
    background: 'rgba(0,0,0,0.8)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    pointerEvents: 'none',
    zIndex: 1000,
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  zoomControls: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    gap: '10px',
    zIndex: 100,
  },
  zoomButton: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s ease',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
    padding: '15px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
  },
  pageButton: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    minWidth: '40px',
  },
  activePageButton: {
    background: 'rgba(76, 175, 80, 0.3)',
    border: '1px solid #4CAF50',
    color: '#4CAF50',
  },
  pageInfo: {
    color: '#fff',
    fontSize: '14px',
    margin: '0 10px',
  },
};

export default function StabilizationProcess() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mq136');
  const [activeOption, setActiveOption] = useState('raw');
  const [hoveredButton, setHoveredButton] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const handleBack = () => {
    navigate('/options');
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset(0);
  };


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginationData = () => {
    if (!csvData || !csvData.data) return { currentData: [], totalPages: 0, totalRows: 0 };
    
    const totalRows = csvData.data.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = csvData.data.slice(startIndex, endIndex);
    
    return { currentData, totalPages, totalRows };
  };

  const exportAsCSV = () => {
    if (!csvData || !csvData.data) {
      alert('No data available to export');
      return;
    }

    const headers = csvData.headers;
    const csvContent = [
      headers.join(','),
      ...csvData.data.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab.toUpperCase()}_data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsExcel = () => {
    if (!csvData || !csvData.data) {
      alert('No data available to export');
      return;
    }

    // Create Excel content using CSV format (simplified approach)
    const headers = csvData.headers;
    const csvContent = [
      headers.join('\t'),
      ...csvData.data.map(row => 
        headers.map(header => row[header] || '').join('\t')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab.toUpperCase()}_data.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateStatisticsReport = () => {
    if (!csvData || !csvData.data) {
      alert('No data available to generate report');
      return;
    }

    const sensorKey = activeTab.toUpperCase();
    const sensorValues = csvData.data.map(row => parseFloat(row[sensorKey]) || 0);
    const voltageValues = csvData.data.map(row => parseFloat(row['Voltage_V']) || 0);

    // Calculate statistics
    const sensorStats = {
      min: Math.min(...sensorValues),
      max: Math.max(...sensorValues),
      mean: sensorValues.reduce((a, b) => a + b, 0) / sensorValues.length,
      median: sensorValues.sort((a, b) => a - b)[Math.floor(sensorValues.length / 2)],
      std: Math.sqrt(sensorValues.reduce((sum, val) => sum + Math.pow(val - (sensorValues.reduce((a, b) => a + b, 0) / sensorValues.length), 2), 0) / sensorValues.length)
    };

    const voltageStats = {
      min: Math.min(...voltageValues),
      max: Math.max(...voltageValues),
      mean: voltageValues.reduce((a, b) => a + b, 0) / voltageValues.length,
      median: voltageValues.sort((a, b) => a - b)[Math.floor(voltageValues.length / 2)],
      std: Math.sqrt(voltageValues.reduce((sum, val) => sum + Math.pow(val - (voltageValues.reduce((a, b) => a + b, 0) / voltageValues.length), 2), 0) / voltageValues.length)
    };

    const report = `
SENSOR DATA ANALYSIS REPORT
============================
Generated: ${new Date().toLocaleString()}
Sensor Type: ${activeTab.toUpperCase()}
Total Records: ${csvData.data.length}

SENSOR DATA STATISTICS
----------------------
Minimum Value: ${sensorStats.min.toFixed(4)}
Maximum Value: ${sensorStats.max.toFixed(4)}
Mean (Average): ${sensorStats.mean.toFixed(4)}
Median: ${sensorStats.median.toFixed(4)}
Standard Deviation: ${sensorStats.std.toFixed(4)}
Range: ${(sensorStats.max - sensorStats.min).toFixed(4)}
Variance: ${Math.pow(sensorStats.std, 2).toFixed(4)}

VOLTAGE DATA STATISTICS
-----------------------
Minimum Value: ${voltageStats.min.toFixed(4)} V
Maximum Value: ${voltageStats.max.toFixed(4)} V
Mean (Average): ${voltageStats.mean.toFixed(4)} V
Median: ${voltageStats.median.toFixed(4)} V
Standard Deviation: ${voltageStats.std.toFixed(4)} V
Range: ${(voltageStats.max - voltageStats.min).toFixed(4)} V
Variance: ${Math.pow(voltageStats.std, 2).toFixed(4)} V²

DATA QUALITY METRICS
--------------------
Data Completeness: ${((csvData.data.filter(row => row[sensorKey] && row['Voltage_V']).length / csvData.data.length) * 100).toFixed(2)}%
Missing Values: ${csvData.data.length - csvData.data.filter(row => row[sensorKey] && row['Voltage_V']).length}
Outliers (3σ): ${sensorValues.filter(val => Math.abs(val - sensorStats.mean) > 3 * sensorStats.std).length}

CORRELATION ANALYSIS
-------------------
Sensor-Voltage Correlation: ${(() => {
  const n = sensorValues.length;
  const sumX = sensorValues.reduce((a, b) => a + b, 0);
  const sumY = voltageValues.reduce((a, b) => a + b, 0);
  const sumXY = sensorValues.reduce((sum, val, i) => sum + val * voltageValues[i], 0);
  const sumX2 = sensorValues.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = voltageValues.reduce((sum, val) => sum + val * val, 0);
  const correlation = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  return correlation.toFixed(4);
})()}

SUMMARY
-------
This report provides comprehensive statistical analysis of ${activeTab.toUpperCase()} sensor data.
The dataset contains ${csvData.data.length} measurements with sensor values ranging from 
${sensorStats.min.toFixed(2)} to ${sensorStats.max.toFixed(2)} and voltage readings from 
${voltageStats.min.toFixed(2)}V to ${voltageStats.max.toFixed(2)}V.

Data quality appears to be ${sensorStats.std < sensorStats.mean * 0.1 ? 'excellent' : sensorStats.std < sensorStats.mean * 0.2 ? 'good' : 'moderate'} 
based on the coefficient of variation (${(sensorStats.std / sensorStats.mean * 100).toFixed(2)}%).
`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab.toUpperCase()}_analysis_report.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadCSVData = async (filename) => {
    if (!filename) return;
    
    setLoading(true);
    try {
      // Try different possible paths for the CSV files
      const possiblePaths = [
        `/IndiBaseline/${filename}`,
        `./IndiBaseline/${filename}`,
        `/public/IndiBaseline/${filename}`,
        `../public/IndiBaseline/${filename}`,
        `/${filename}`,
        `./${filename}`
      ];
      
      let response = null;
      let text = '';
      
      for (const path of possiblePaths) {
        try {
          response = await fetch(path);
          if (response.ok) {
            text = await response.text();
            // Check if we got HTML instead of CSV
            if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
              console.log(`Got HTML instead of CSV from ${path}`);
              continue;
            }
            break;
          }
        } catch (e) {
          console.log(`Failed to load from ${path}:`, e.message);
          continue;
        }
      }
      
      if (!response || !response.ok) {
        throw new Error('Could not load CSV file from any path');
      }
      
      if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
        throw new Error('Received HTML instead of CSV data');
      }
      
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        throw new Error('Empty CSV file');
      }
      
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1, 101).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index]?.trim() || '';
          return obj;
        }, {});
      });
      
      setCsvData({ 
        headers, 
        data, 
        totalRows: lines.length - 1,
        filename 
      });
    } catch (error) {
      console.error('Error loading CSV:', error);
      setCsvData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const content = getTabContent();
    if (content.csvFile) {
      loadCSVData(content.csvFile);
    }
    setCurrentPage(1); // Reset to first page when switching tabs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const generateChartData = () => {
    // Generate sample data if CSV data is not available
    const generateSampleData = () => {
      const sampleData = [];
      for (let i = 0; i < 50; i++) {
        sampleData.push({
          x: i,
          sensor: 2000 + Math.sin(i * 0.2) * 500 + Math.random() * 200,
          voltage: 2.5 + Math.sin(i * 0.15) * 0.3 + Math.random() * 0.2
        });
      }
      return sampleData;
    };

    let sensorData;
    if (csvData && csvData.data && csvData.data.length > 0) {
      const sensorKey = activeTab.toUpperCase();
      sensorData = csvData.data.map((row, index) => ({
        x: index,
        sensor: parseFloat(row[sensorKey]) || 0,
        voltage: parseFloat(row['Voltage_V']) || 0
      }));
    } else {
      sensorData = generateSampleData();
    }

    // Generate bell curve data
    const sensorValues = sensorData.map(d => d.sensor);
    const voltageValues = sensorData.map(d => d.voltage);
    
    const sensorMean = sensorValues.reduce((a, b) => a + b, 0) / sensorValues.length;
    const voltageMean = voltageValues.reduce((a, b) => a + b, 0) / voltageValues.length;
    
    const sensorStd = Math.sqrt(sensorValues.reduce((sum, val) => sum + Math.pow(val - sensorMean, 2), 0) / sensorValues.length);
    const voltageStd = Math.sqrt(voltageValues.reduce((sum, val) => sum + Math.pow(val - voltageMean, 2), 0) / voltageValues.length);

    // Apply stabilization scaling based on sensor type
    const getStabilizedScaling = (sensorType, values) => {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      
      switch (sensorType) {
        case 'MQ136':
          // MQ136: Fixed scale 100-200
          return {
            min: 100,
            max: 200,
            center: mean
          };
        case 'MQ138':
          // MQ138: Fixed scale 2500-2800
          return {
            min: 2500,
            max: 2800,
            center: mean
          };
        case 'SGP40':
          // SGP40: Fixed scale 30000-40000
          return {
            min: 30000,
            max: 40000,
            center: mean
          };
        case 'SPEC':
          // SPEC: Fixed scale 0.5-3.0 (based on typical SPEC sensor range)
          return {
            min: 0.5,
            max: 3.0,
            center: mean
          };
        default:
          return { min, max, center: mean };
      }
    };

    const sensorScaling = getStabilizedScaling(activeTab.toUpperCase(), sensorValues);

    return {
      lineData: sensorData,
      barData: [
        { name: 'Min Sensor', sensor: Math.min(...sensorValues), voltage: Math.min(...voltageValues) },
        { name: 'Max Sensor', sensor: Math.max(...sensorValues), voltage: Math.max(...voltageValues) },
        { name: 'Avg Sensor', sensor: sensorMean, voltage: voltageMean },
        { name: 'Std Dev', sensor: sensorStd, voltage: voltageStd }
      ],
      bellCurve: {
        sensor: { mean: sensorMean, std: sensorStd, values: sensorValues },
        voltage: { mean: voltageMean, std: voltageStd, values: voltageValues }
      },
      scaling: {
        sensor: sensorScaling,
        voltage: {
          min: 2.0,
          max: 5.0,
          center: voltageMean
        }
      }
    };
  };

  const tabs = [
    { id: 'mq136', label: 'MQ136 Data', icon: '🔍' },
    { id: 'mq138', label: 'MQ138 Data', icon: '📊' },
    { id: 'sgp40', label: 'SGP40 Data', icon: '🌡️' },
    { id: 'spec', label: 'SPEC Data', icon: '⚡' },
    { id: 'bme', label: 'BME Data', icon: '🔬' },
  ];

  const options = [
    { id: 'raw', label: 'Raw Data', icon: '📄' },
    { id: 'analytical', label: 'Analytical Data', icon: '📈' },
    { id: 'export', label: 'Export Data', icon: '💾' },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'mq136':
        return {
          title: 'MQ136 Sensor Data',
          description: 'Monitor MQ136 gas sensor stabilization data with real-time readings and trend analysis.',
          csvFile: 'MQ136.csv',
          totalRecords: '12,178'
        };
      case 'mq138':
        return {
          title: 'MQ138 Sensor Data',
          description: 'Track MQ138 ammonia sensor stabilization process with comprehensive data analysis.',
          csvFile: 'MQ138.csv',
          totalRecords: '1,449'
        };
      case 'sgp40':
        return {
          title: 'SGP40 Sensor Data',
          description: 'Analyze SGP40 VOC sensor stabilization data with environmental monitoring capabilities.',
          csvFile: 'SGP40.csv',
          totalRecords: '6,486'
        };
      case 'spec':
        return {
          title: 'SPEC Sensor Data',
          description: 'Monitor SPEC sensor stabilization with gas concentration and reference voltage analysis.',
          csvFile: 'SPEC.csv',
          totalRecords: '3,661'
        };
      case 'bme':
        return {
          title: 'BME Sensor Data',
          description: 'Comprehensive BME688 sensor stabilization monitoring with temperature, humidity, and pressure data.',
          csvFile: null,
          totalRecords: 'Coming Soon'
        };
      default:
        return null;
    }
  };

  const content = getTabContent();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Stabilization Process Data</h1>
        <button
          style={hoveredButton === 'back' ? { ...styles.backButton, ...styles.backButtonHover } : styles.backButton}
          onClick={handleBack}
          onMouseEnter={() => setHoveredButton('back')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          ← Back to Options
        </button>
      </div>

      <div style={styles.tabContainer}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={activeTab === tab.id ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ marginRight: '8px' }}>{tab.icon}</span>
            {tab.label}
          </div>
        ))}
      </div>

      <div style={styles.contentContainer}>
        <h2 style={styles.contentTitle}>{content.title}</h2>
        <p style={styles.contentDescription}>{content.description}</p>
        
        <div style={styles.tabContainer}>
          {options.map((option) => (
            <div
              key={option.id}
              style={activeOption === option.id ? { ...styles.tab, ...styles.activeTab } : styles.tab}
              onClick={() => setActiveOption(option.id)}
            >
              <span style={{ marginRight: '8px' }}>{option.icon}</span>
              {option.label}
            </div>
          ))}
        </div>

        {activeOption === 'raw' && (
          <div style={styles.optionContent}>
            <h3 style={styles.optionTitle}>Raw Data Viewer</h3>
            <p style={styles.optionDescription}>
              View raw sensor data in CSV format with pagination. Showing 20 rows per page.
            </p>
            {content.csvFile ? (
              <div style={styles.csvViewer}>
                {loading ? (
                  <div style={styles.loadingMessage}>Loading data...</div>
                ) : csvData ? (
                  <>
                    <div style={styles.csvPreview}>
                      <div style={styles.csvHeader}>
                        CSV Data - Page {currentPage} of {getPaginationData().totalPages} 
                        (Total records: {getPaginationData().totalRows})
                      </div>
                      <div style={styles.csvTable}>
                        <div style={styles.csvRow}>
                          {csvData.headers.map((header, index) => (
                            <div key={index} style={styles.csvCell}>{header}</div>
                          ))}
                        </div>
                        {getPaginationData().currentData.map((row, index) => (
                          <div key={index} style={styles.csvRow}>
                            {csvData.headers.map((header, headerIndex) => (
                              <div key={headerIndex} style={styles.csvCell}>
                                {row[header] || '-'}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Pagination Controls */}
                    <div style={styles.paginationContainer}>
                      <button 
                        style={styles.pageButton}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        ⏮️ First
                      </button>
                      <button 
                        style={styles.pageButton}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ⏪ Previous
                      </button>
                      
                      {/* Page Numbers */}
                      {(() => {
                        const { totalPages } = getPaginationData();
                        const pages = [];
                        const startPage = Math.max(1, currentPage - 2);
                        const endPage = Math.min(totalPages, currentPage + 2);
                        
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              style={{
                                ...styles.pageButton,
                                ...(i === currentPage ? styles.activePageButton : {})
                              }}
                              onClick={() => handlePageChange(i)}
                            >
                              {i}
                            </button>
                          );
                        }
                        return pages;
                      })()}
                      
                      <button 
                        style={styles.pageButton}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === getPaginationData().totalPages}
                      >
                        Next ⏩
                      </button>
                      <button 
                        style={styles.pageButton}
                        onClick={() => handlePageChange(getPaginationData().totalPages)}
                        disabled={currentPage === getPaginationData().totalPages}
                      >
                        Last ⏭️
                      </button>
                      
                      <div style={styles.pageInfo}>
                        Page {currentPage} of {getPaginationData().totalPages}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={styles.csvPreview}>
                    <div style={styles.csvHeader}>
                      Sample Data Preview (CSV file not accessible)
                    </div>
                    <div style={styles.csvTable}>
                      <div style={styles.csvRow}>
                        <div style={styles.csvCell}>SNO</div>
                        <div style={styles.csvCell}>Date</div>
                        <div style={styles.csvCell}>Time</div>
                        <div style={styles.csvCell}>{activeTab.toUpperCase()}</div>
                        <div style={styles.csvCell}>Voltage_V</div>
                      </div>
                      {[...Array(10)].map((_, i) => (
                        <div key={i} style={styles.csvRow}>
                          <div style={styles.csvCell}>{i + 1}</div>
                          <div style={styles.csvCell}>26-09-2025</div>
                          <div style={styles.csvCell}>14:48:20:129489</div>
                          <div style={styles.csvCell}>{Math.floor(Math.random() * 1000) + 2000}</div>
                          <div style={styles.csvCell}>2.59</div>
                        </div>
                      ))}
                    </div>
                    <div style={styles.errorMessage}>
                      Note: Unable to load actual CSV file. Showing sample data structure.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.comingSoon}>
                Raw data not available - Coming Soon!
              </div>
            )}
          </div>
        )}

        {activeOption === 'analytical' && (
          <div style={styles.optionContent}>
            <h3 style={styles.optionTitle}>Analytical Data</h3>
            <p style={styles.optionDescription}>
              Interactive graphs and charts showing sensor data trends and analysis
            </p>
            {content.csvFile ? (
              <div style={styles.graphContainer}>
                {loading ? (
                  <div style={styles.loadingMessage}>Loading analytical data...</div>
                ) : (
                  <div style={styles.graphGridLarge}>
                    <div style={styles.largeGraphCard}>
                      <h4 style={styles.graphTitle}>Interactive Line Graph - Sensor Data vs Voltage</h4>
                      <div style={styles.interactiveGraph}>
                        {/* Zoom Controls */}
                        <div style={styles.zoomControls}>
                          <button style={styles.zoomButton} onClick={handleZoomIn}>🔍+</button>
                          <button style={styles.zoomButton} onClick={handleZoomOut}>🔍-</button>
                          <button style={styles.zoomButton} onClick={handleResetZoom}>Reset</button>
                        </div>
                        
                        <svg width="100%" height="400" viewBox="0 0 800 400">
                          {(() => {
                            const chartData = generateChartData();
                            if (!chartData) return null;
                            
                            // Use stabilized scaling for better visualization
                            const sensorScaling = chartData.scaling.sensor;
                            const voltageScaling = chartData.scaling.voltage;
                            
                            const padding = 60;
                            const chartWidth = 800 - 2 * padding;
                            const chartHeight = 400 - 2 * padding;
                            
                            // Apply zoom and pan
                            const visibleDataLength = Math.ceil(chartData.lineData.length / zoomLevel);
                            const startIndex = Math.max(0, Math.floor(panOffset * chartData.lineData.length));
                            const endIndex = Math.min(chartData.lineData.length, startIndex + visibleDataLength);
                            const visibleData = chartData.lineData.slice(startIndex, endIndex);
                            
                            const scaleX = chartWidth / visibleData.length;
                            const scaleSensor = chartHeight / (sensorScaling.max - sensorScaling.min);
                            const scaleVoltage = chartHeight / (voltageScaling.max - voltageScaling.min);
                            
                            const sensorPoints = visibleData.map((d, i) => 
                              `${padding + i * scaleX},${400 - padding - (d.sensor - sensorScaling.min) * scaleSensor}`
                            ).join(' ');
                            
                            const voltagePoints = visibleData.map((d, i) => 
                              `${padding + i * scaleX},${400 - padding - (d.voltage - voltageScaling.min) * scaleVoltage}`
                            ).join(' ');
                            
                            // Generate Y-axis labels for sensor data
                            const sensorTicks = 5;
                            const sensorStep = (sensorScaling.max - sensorScaling.min) / (sensorTicks - 1);
                            
                            // Generate Y-axis labels for voltage
                            const voltageTicks = 5;
                            const voltageStep = (voltageScaling.max - voltageScaling.min) / (voltageTicks - 1);
                            
                            return (
                              <>
                                {/* Grid lines */}
                                <defs>
                                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                                
                                {/* Y-axis for sensor data (left) */}
                                {[...Array(sensorTicks)].map((_, i) => {
                                  const value = sensorScaling.min + i * sensorStep;
                                  const y = 400 - padding - i * (chartHeight / (sensorTicks - 1));
                                  return (
                                    <g key={i}>
                                      <line x1={padding} y1={y} x2={padding + chartWidth} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                                      <text x={padding - 10} y={y + 5} fill="#4CAF50" fontSize="12" textAnchor="end">
                                        {value.toFixed(0)}
                                      </text>
                                    </g>
                                  );
                                })}
                                
                                {/* Y-axis for voltage (right) */}
                                {[...Array(voltageTicks)].map((_, i) => {
                                  const value = voltageScaling.min + i * voltageStep;
                                  const y = 400 - padding - i * (chartHeight / (voltageTicks - 1));
                                  return (
                                    <g key={i}>
                                      <text x={padding + chartWidth + 10} y={y + 5} fill="#2196F3" fontSize="12">
                                        {value.toFixed(2)}V
                                      </text>
                                    </g>
                                  );
                                })}
                                
                                {/* X-axis */}
                                <line x1={padding} y1={400 - padding} x2={padding + chartWidth} y2={400 - padding} stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                                
                                {/* Data lines */}
                                <polyline
                                  points={sensorPoints}
                                  fill="none"
                                  stroke="#4CAF50"
                                  strokeWidth="3"
                                />
                                <polyline
                                  points={voltagePoints}
                                  fill="none"
                                  stroke="#2196F3"
                                  strokeWidth="3"
                                />
                                
                                {/* Interactive data points */}
                                {visibleData.map((d, i) => {
                                  const x = padding + i * scaleX;
                                  const sensorY = 400 - padding - (d.sensor - sensorScaling.min) * scaleSensor;
                                  const voltageY = 400 - padding - (d.voltage - voltageScaling.min) * scaleVoltage;
                                  
                                  return (
                                    <g key={i}>
                                      {/* Sensor data point */}
                                      <circle
                                        cx={x}
                                        cy={sensorY}
                                        r="4"
                                        fill="#4CAF50"
                                        stroke="white"
                                        strokeWidth="1"
                                        style={styles.dataPoint}
                                      />
                                      {/* Voltage data point */}
                                      <circle
                                        cx={x}
                                        cy={voltageY}
                                        r="4"
                                        fill="#2196F3"
                                        stroke="white"
                                        strokeWidth="1"
                                        style={styles.dataPoint}
                                      />
                                    </g>
                                  );
                                })}
                                
                                {/* Legend */}
                                <text x={padding + 20} y={30} fill="#4CAF50" fontSize="16" fontWeight="bold">Sensor Data</text>
                                <text x={padding + 20} y={50} fill="#2196F3" fontSize="16" fontWeight="bold">Voltage</text>
                                
                                {/* Axis labels */}
                                <text x={padding + chartWidth/2} y={390} fill="#fff" fontSize="14" textAnchor="middle">
                                  Data Points {zoomLevel > 1 ? `(Zoom: ${zoomLevel.toFixed(1)}x)` : ''}
                                </text>
                                <text x={20} y={padding + chartHeight/2} fill="#4CAF50" fontSize="14" textAnchor="middle" transform={`rotate(-90, 20, ${padding + chartHeight/2})`}>Sensor Values</text>
                                <text x={780} y={padding + chartHeight/2} fill="#2196F3" fontSize="14" textAnchor="middle" transform={`rotate(90, 780, ${padding + chartHeight/2})`}>Voltage (V)</text>
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                    </div>
                    
                    <div style={styles.largeGraphCard}>
                      <h4 style={styles.graphTitle}>Bell Curve - Sensor Data Distribution</h4>
                      <div style={styles.bellCurve}>
                        <svg width="100%" height="400" viewBox="0 0 800 400">
                          {(() => {
                            const chartData = generateChartData();
                            if (!chartData) return null;
                            
                            const { mean, std } = chartData.bellCurve.sensor;
                            const scaling = chartData.scaling.sensor;
                            const range = scaling.max - scaling.min;
                            const step = range / 50;
                            
                            const padding = 60;
                            const chartWidth = 800 - 2 * padding;
                            const chartHeight = 400 - 2 * padding;
                            
                            const points = [];
                            for (let i = 0; i <= 50; i++) {
                              const x = scaling.min + i * step;
                              const y = Math.exp(-0.5 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
                              const scaledX = padding + (x - scaling.min) / range * chartWidth;
                              const scaledY = 400 - padding - y * 10000; // Scale up for visibility
                              points.push(`${scaledX},${scaledY}`);
                            }
                            
                            // Generate Y-axis labels
                            const maxY = Math.exp(-0.5 * Math.pow(0, 2)) / (std * Math.sqrt(2 * Math.PI));
                            const yTicks = 5;
                            const yStep = maxY / (yTicks - 1);
                            
                            return (
                              <>
                                {/* Grid lines */}
                                <defs>
                                  <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid2)" />
                                
                                {/* Y-axis labels */}
                                {[...Array(yTicks)].map((_, i) => {
                                  const value = i * yStep;
                                  const y = 400 - padding - i * (chartHeight / (yTicks - 1));
                                  return (
                                    <g key={i}>
                                      <line x1={padding} y1={y} x2={padding + chartWidth} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                                      <text x={padding - 10} y={y + 5} fill="#FF9800" fontSize="12" textAnchor="end">
                                        {(value * 10000).toFixed(0)}
                                      </text>
                                    </g>
                                  );
                                })}
                                
                                {/* X-axis */}
                                <line x1={padding} y1={400 - padding} x2={padding + chartWidth} y2={400 - padding} stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                                
                                {/* X-axis labels */}
                                {[...Array(6)].map((_, i) => {
                                  const value = scaling.min + (i * range / 5);
                                  const x = padding + (i * chartWidth / 5);
                                  return (
                                    <text key={i} x={x} y={390} fill="#FF9800" fontSize="12" textAnchor="middle">
                                      {value.toFixed(0)}
                                    </text>
                                  );
                                })}
                                
                                {/* Bell curve */}
                                <polyline
                                  points={points.join(' ')}
                                  fill="none"
                                  stroke="#FF9800"
                                  strokeWidth="3"
                                />
                                
                                {/* Mean line */}
                                <line 
                                  x1={padding + (mean - scaling.min) / range * chartWidth} 
                                  y1={400 - padding} 
                                  x2={padding + (mean - scaling.min) / range * chartWidth} 
                                  y2={400 - padding - chartHeight} 
                                  stroke="#FF9800" 
                                  strokeWidth="2" 
                                  strokeDasharray="5,5"
                                />
                                
                                {/* Labels */}
                                <text x={padding + chartWidth/2} y={390} fill="#fff" fontSize="14" textAnchor="middle">Sensor Values</text>
                                <text x={20} y={padding + chartHeight/2} fill="#FF9800" fontSize="14" textAnchor="middle" transform={`rotate(-90, 20, ${padding + chartHeight/2})`}>Probability Density</text>
                                <text x={padding + (mean - scaling.min) / range * chartWidth} y={350} fill="#FF9800" fontSize="12" textAnchor="middle">Mean: {mean.toFixed(1)}</text>
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                    </div>
                    
                    <div style={styles.largeGraphCard}>
                      <h4 style={styles.graphTitle}>Bell Curve - Voltage Distribution</h4>
                      <div style={styles.bellCurve}>
                        <svg width="100%" height="400" viewBox="0 0 800 400">
                          {(() => {
                            const chartData = generateChartData();
                            if (!chartData) return null;
                            
                            const { mean, std } = chartData.bellCurve.voltage;
                            const scaling = chartData.scaling.voltage;
                            const range = scaling.max - scaling.min;
                            const step = range / 50;
                            
                            const padding = 60;
                            const chartWidth = 800 - 2 * padding;
                            const chartHeight = 400 - 2 * padding;
                            
                            const points = [];
                            for (let i = 0; i <= 50; i++) {
                              const x = scaling.min + i * step;
                              const y = Math.exp(-0.5 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
                              const scaledX = padding + (x - scaling.min) / range * chartWidth;
                              const scaledY = 400 - padding - y * 10000; // Scale up for visibility
                              points.push(`${scaledX},${scaledY}`);
                            }
                            
                            // Generate Y-axis labels
                            const maxY = Math.exp(-0.5 * Math.pow(0, 2)) / (std * Math.sqrt(2 * Math.PI));
                            const yTicks = 5;
                            const yStep = maxY / (yTicks - 1);
                            
                            return (
                              <>
                                {/* Grid lines */}
                                <defs>
                                  <pattern id="grid3" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid3)" />
                                
                                {/* Y-axis labels */}
                                {[...Array(yTicks)].map((_, i) => {
                                  const value = i * yStep;
                                  const y = 400 - padding - i * (chartHeight / (yTicks - 1));
                                  return (
                                    <g key={i}>
                                      <line x1={padding} y1={y} x2={padding + chartWidth} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                                      <text x={padding - 10} y={y + 5} fill="#9C27B0" fontSize="12" textAnchor="end">
                                        {(value * 10000).toFixed(0)}
                                      </text>
                                    </g>
                                  );
                                })}
                                
                                {/* X-axis */}
                                <line x1={padding} y1={400 - padding} x2={padding + chartWidth} y2={400 - padding} stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                                
                                {/* X-axis labels */}
                                {[...Array(6)].map((_, i) => {
                                  const value = scaling.min + (i * range / 5);
                                  const x = padding + (i * chartWidth / 5);
                                  return (
                                    <text key={i} x={x} y={390} fill="#9C27B0" fontSize="12" textAnchor="middle">
                                      {value.toFixed(2)}V
                                    </text>
                                  );
                                })}
                                
                                {/* Bell curve */}
                                <polyline
                                  points={points.join(' ')}
                                  fill="none"
                                  stroke="#9C27B0"
                                  strokeWidth="3"
                                />
                                
                                {/* Mean line */}
                                <line 
                                  x1={padding + (mean - scaling.min) / range * chartWidth} 
                                  y1={400 - padding} 
                                  x2={padding + (mean - scaling.min) / range * chartWidth} 
                                  y2={400 - padding - chartHeight} 
                                  stroke="#9C27B0" 
                                  strokeWidth="2" 
                                  strokeDasharray="5,5"
                                />
                                
                                {/* Labels */}
                                <text x={padding + chartWidth/2} y={390} fill="#fff" fontSize="14" textAnchor="middle">Voltage (V)</text>
                                <text x={20} y={padding + chartHeight/2} fill="#9C27B0" fontSize="14" textAnchor="middle" transform={`rotate(-90, 20, ${padding + chartHeight/2})`}>Probability Density</text>
                                <text x={padding + (mean - scaling.min) / range * chartWidth} y={350} fill="#9C27B0" fontSize="12" textAnchor="middle">Mean: {mean.toFixed(2)}V</text>
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                    </div>
                    {!csvData && (
                      <div style={styles.sampleDataNotice}>
                        📊 Showing sample data - CSV file not accessible
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.comingSoon}>
                Analytical data not available - Coming Soon!
              </div>
            )}
          </div>
        )}

        {activeOption === 'export' && (
          <div style={styles.optionContent}>
            <h3 style={styles.optionTitle}>Export Data</h3>
            <p style={styles.optionDescription}>
              Export sensor data in various formats for further analysis
            </p>
            {content.csvFile ? (
              <div style={styles.exportContainer}>
                <div style={styles.exportOptions}>
                  <button 
                    style={styles.exportButton}
                    onClick={exportAsCSV}
                    title="Download data as CSV file"
                  >
                    📄 Export as CSV
                  </button>
                  <button 
                    style={styles.exportButton}
                    onClick={exportAsExcel}
                    title="Download data as Excel file"
                  >
                    📊 Export as Excel
                  </button>
                  <button 
                    style={styles.exportButton}
                    onClick={generateStatisticsReport}
                    title="Download comprehensive analysis report"
                  >
                    📋 Export Report
                  </button>
                </div>
                <div style={styles.exportInfo}>
                  <p>Available formats: CSV, Excel (.xls), Text Report (.txt)</p>
                  <p>Data range: All {content.totalRecords} records</p>
                  <p>Report includes: Min/Max analysis, statistics, correlation, data quality metrics</p>
                </div>
              </div>
            ) : (
              <div style={styles.comingSoon}>
                Export functionality not available - Coming Soon!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
