import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';

// Memoized Plot component for better performance
const MemoizedPlot = memo(Plot);

// Performance optimization: Detect if device prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Performance optimization: Detect device performance
const isLowPerformanceDevice = () => {
  // Check for common indicators of lower-end devices
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
  const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  const hasSlowConnection = navigator.connection && navigator.connection.effectiveType === 'slow-2g';
  
  return isMobile || hasLowMemory || hasSlowConnection || prefersReducedMotion;
};

const shouldDisableAnimations = isLowPerformanceDevice();

// Log performance mode status
if (shouldDisableAnimations) {
  console.log('🚀 Performance Mode Enabled: Animations disabled for better performance');
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    display: 'flex',
    overflow: 'hidden',
  },
  sidebar: {
    width: '300px',
    background: 'rgba(0,0,0,0.2)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    overflowY: 'auto',
    zIndex: 100,
  },
  mainContent: {
    flex: 1,
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    overflowY: 'auto',
    minHeight: '100vh',
    marginLeft: '300px',
    width: 'calc(100vw - 300px)',
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
    position: 'fixed',
    top: '20px',
    left: '320px',
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: shouldDisableAnimations ? 'none' : 'background-color 0.2s ease',
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  backButtonHover: {
    background: 'rgba(255,255,255,0.3)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '15px',
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: '#ffffff',
    color: '#000000',
    fontSize: '14px',
    marginBottom: '15px',
    cursor: 'pointer',
    transition: shouldDisableAnimations ? 'none' : 'border-color 0.2s ease',
  },
  selectOption: {
    background: '#ffffff',
    color: '#000000',
    padding: '8px',
  },
  fileSelector: {
    marginBottom: '20px',
    position: 'relative',
  },
  button: {
    padding: '14px 20px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
    transition: shouldDisableAnimations ? 'none' : 'background 0.2s ease',
    marginBottom: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  buttonHover: {
    background: 'linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  card: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '30px',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(31, 38, 135, 0.2)',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.6rem',
    fontWeight: 700,
    marginBottom: '25px',
    color: '#fff',
    borderBottom: '2px solid rgba(255,255,255,0.3)',
    paddingBottom: '12px',
    textAlign: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  statItem: {
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: shouldDisableAnimations ? 'none' : 'background-color 0.2s ease',
    cursor: 'pointer',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#4fc3f7',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  statLabel: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 500,
  },
  heaterProfileSection: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '25px',
    marginTop: '20px',
  },
  heaterProfileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '25px',
    marginTop: '20px',
  },
  heaterProfileCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '25px',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: shouldDisableAnimations ? 'none' : 'background-color 0.2s ease',
    cursor: 'pointer',
  },
  heaterProfileTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#4fc3f7',
    marginBottom: '15px',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  phaseSection: {
    marginBottom: '20px',
  },
  phaseTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '12px',
    padding: '10px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    textAlign: 'center',
  },
  sensorStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
    marginBottom: '12px',
  },
  sensorStat: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    padding: '8px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  sensorStatValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#4fc3f7',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  },
  csvViewer: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '20px',
    maxHeight: '500px',
    overflow: 'auto',
  },
  csvTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  csvHeader: {
    background: 'rgba(255,255,255,0.1)',
    padding: '10px',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    position: 'sticky',
    top: 0,
  },
  csvCell: {
    padding: '8px 10px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.8rem',
  },
  loading: {
    textAlign: 'center',
    color: '#fff',
    fontSize: '1.3rem',
    marginTop: '60px',
    fontWeight: 500,
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontSize: '1.3rem',
    marginTop: '60px',
    fontWeight: 500,
  },
  fileSelectorLabel: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '10px',
    display: 'block',
  },
  tabContainer: {
    display: 'flex',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '8px',
    marginBottom: '25px',
    border: '1px solid rgba(255,255,255,0.2)',
    flexWrap: 'wrap',
  },
  tab: {
    flex: 1,
    padding: '14px 22px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 600,
    transition: shouldDisableAnimations ? 'none' : 'background-color 0.2s ease',
    minWidth: '120px',
  },
  activeTab: {
    background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  tabContent: {
    display: 'none',
  },
  activeTabContent: {
    display: 'block',
  },
  chartContainer: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '25px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(550px, 1fr))',
    gap: '25px',
    marginTop: '20px',
  },
  sensorStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '25px',
    marginTop: '20px',
  },
  sensorCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '25px',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: shouldDisableAnimations ? 'none' : 'background-color 0.2s ease',
    cursor: 'pointer',
  },
  sensorCardTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#4fc3f7',
    marginBottom: '20px',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  sensorStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
  },
  sensorStatItem: {
    textAlign: 'center',
    padding: '15px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  sensorStatLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '8px',
    fontWeight: 500,
  },
  phaseSelector: {
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: 'rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '10px',
    flexWrap: 'wrap',
  },
  phaseSelectorLabel: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
  },
  phaseSelect: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: '#ffffff',
    color: '#000000',
    fontSize: '14px',
    cursor: 'pointer',
    minWidth: '150px',
  },
  downloadSection: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  downloadButton: {
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
    transition: shouldDisableAnimations ? 'none' : 'background 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  downloadButtonHover: {
    background: 'linear-gradient(90deg, #45a049 0%, #4caf50 100%)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  statItemHover: {
    background: 'rgba(255,255,255,0.15)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  sensorCardHover: {
    background: 'rgba(255,255,255,0.15)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  heaterProfileCardHover: {
    background: 'rgba(255,255,255,0.15)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  csvControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
    padding: '15px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  searchSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.9)',
    color: '#000',
    fontSize: '14px',
  },
  filterSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.9)',
    color: '#000',
    fontSize: '14px',
    minWidth: '120px',
  },
  filterInput: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.9)',
    color: '#000',
    fontSize: '14px',
    minWidth: '120px',
  },
  paginationSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: 'space-between',
  },
  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  paginationButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
    transition: shouldDisableAnimations ? 'none' : 'background-color 0.2s ease',
  },
  paginationButtonHover: {
    background: 'rgba(255,255,255,0.2)',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  pageSizeSelect: {
    padding: '6px 8px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.9)',
    color: '#000',
    fontSize: '12px',
  },
  exportButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: shouldDisableAnimations ? 'none' : 'background 0.2s ease',
  },
  exportButtonHover: {
    background: 'linear-gradient(90deg, #f57c00 0%, #ff9800 100%)',
  },
  dataSummary: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  summaryText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '14px',
    marginBottom: '5px',
  },
  sortableHeader: {
    cursor: 'pointer',
    userSelect: 'none',
    transition: shouldDisableAnimations ? 'none' : 'background-color 0.2s ease',
  },
  sortableHeaderHover: {
    background: 'rgba(255,255,255,0.1)',
  },
  sortIcon: {
    marginLeft: '5px',
    fontSize: '12px',
  },
};

// Performance indicator component
const PerformanceIndicator = () => {
  if (!shouldDisableAnimations) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(255, 193, 7, 0.9)',
      color: '#000',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 600,
      zIndex: 1001,
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      ⚡ Performance Mode
    </div>
  );
};

export default function Phase2Dashboard() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [availableFiles, setAvailableFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHeaterProfile, setSelectedHeaterProfile] = useState('all');

  const [hoveredStats, setHoveredStats] = useState({});
  const [hoveredSensors, setHoveredSensors] = useState({});
  const [hoveredProfiles, setHoveredProfiles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    loadAvailableFiles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load data based on selected file
  useEffect(() => {
    const loadData = async () => {
      if (!selectedFile) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading CSV file from public folder...');
        
        // Load CSV file directly from public folder
        const response = await fetch(`/Phase2/${selectedFile}`);
        const csvText = await response.text();
        
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
        
        setData(rows);
        setLoading(false);
      } catch (err) {
        console.error('Error loading CSV file:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [selectedFile]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedColumn, filterValue, pageSize]);

  // Helper functions (moved before useMemo hooks)
  const calculateDetailedStats = (data) => {
    if (!data || data.length === 0) return {};

    const phases = ['Pre-Puff', 'Puff', 'Post-Puff'];
    const sensors = ['BME_HeaterRes', 'MQ136_RAW', 'MQ138_RAW', 'Alpha_PID', 'SPEC', 'SGP40_VOC'];
    const stats = {};

    // Overall stats
    stats.totalRecords = data.length;
    const heaterProfiles = data.map(row => row.Heater_Profile);
    const uniqueHeaterProfiles = [...new Set(heaterProfiles)];
    stats.uniqueHeaterProfiles = uniqueHeaterProfiles.length;

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
    
    // Calculate the theoretical normal distribution
    const y = x.map(xVal => {
      return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((xVal - mean) / std, 2));
    });
    
    // Scale the theoretical curve to match the histogram scale
    const maxHistogramHeight = Math.max(...Array.from({ length: 20 }, (_, i) => {
      const binStart = mean - 3 * std + (6 * std * i) / 20;
      const binEnd = mean - 3 * std + (6 * std * (i + 1)) / 20;
      return values.filter(v => v >= binStart && v < binEnd).length;
    }));
    
    const maxTheoreticalHeight = Math.max(...y);
    const scaleFactor = maxHistogramHeight / maxTheoreticalHeight;
    const scaledY = y.map(val => val * scaleFactor);
    
    return {
      x: x,
      y: scaledY,
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

  // Memoized expensive calculations
  const stats = useMemo(() => {
    if (!data || data.length === 0) return {};
    return calculateDetailedStats(data);
  }, [data]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.filter(row => {
      const matchesSearchTerm = Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (selectedColumn && filterValue) {
        const columnValue = row[selectedColumn];
        if (typeof columnValue === 'string') {
          return matchesSearchTerm && columnValue.toLowerCase().includes(filterValue.toLowerCase());
        } else if (typeof columnValue === 'number') {
          return matchesSearchTerm && columnValue.toString().includes(filterValue);
        }
      }
      return matchesSearchTerm;
    });
  }, [data, searchTerm, selectedColumn, filterValue]);

  // Memoized pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      totalPages,
      paginatedData
    };
  }, [filteredData, currentPage, pageSize]);

  // Memoized sorted data
  const sortedData = useMemo(() => {
    const { paginatedData } = paginationData;
    if (!sortColumn) return paginatedData;
    
    return [...paginatedData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [paginationData, sortColumn, sortDirection]);

  // Memoized bell curve data
  const bellCurveData = useMemo(() => {
    if (!data || data.length === 0) return {};
    
    const curves = {};
    Object.keys(stats.heaterProfiles || {}).forEach(profile => {
      curves[profile] = {};
      ['Pre-Puff', 'Puff', 'Post-Puff'].forEach(phase => {
        const profileData = stats.heaterProfiles[profile];
        const phaseData = profileData?.phases[phase];
        
        if (phaseData && phaseData.count > 0) {
          const values = phaseData.sensors.BME_HeaterRes?.values || [];
          if (values.length > 0) {
            curves[profile][phase] = generateBellCurveData(values, 'BME_HeaterRes');
          }
        }
      });
    });
    return curves;
  }, [stats, data]);

  // Memoized correlation matrices
  const correlationMatrices = useMemo(() => {
    if (!data || data.length === 0) return {};
    
    const matrices = {};
    Object.keys(stats.heaterProfiles || {}).forEach(profile => {
      const profileData = data.filter(row => row.Heater_Profile === profile);
      matrices[profile] = generateCorrelationMatrix(profileData);
    });
    return matrices;
  }, [data, stats]);

  const loadAvailableFiles = async () => {
    try {
      // For Netlify deployment, load files directly from public folder
      const files = ['01Aug_Phase2_Ammonia.csv', '05Aug_Phase2_p-Cresol.csv'];
      setAvailableFiles(files);
      if (files.length > 0 && !selectedFile) {
        setSelectedFile(files[0]);
      }
    } catch (err) {
      console.error('Error loading available files:', err);
      // Fallback to hardcoded files
      const fallbackFiles = ['01Aug_Phase2_Ammonia.csv', '05Aug_Phase2_p-Cresol.csv'];
      setAvailableFiles(fallbackFiles);
      if (!selectedFile) {
        setSelectedFile(fallbackFiles[0]);
      }
    }
  };

  // Memoized event handlers
  const handleSort = useCallback((column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  const handleExportFilteredCSV = useCallback(() => {
    if (!filteredData || filteredData.length === 0) return;

    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile.replace('.csv', '_filtered')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [filteredData, selectedFile]);

  const handleDownloadCSV = useCallback(() => {
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
  }, [data, selectedFile]);

  const handleBack = useCallback(() => {
    navigate('/options');
  }, [navigate]);

  const handleFileChange = useCallback((e) => {
    setSelectedFile(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleColumnChange = useCallback((e) => {
    setSelectedColumn(e.target.value);
  }, []);

  const handleFilterChange = useCallback((e) => {
    setFilterValue(e.target.value);
  }, []);

  const handlePageSizeChange = useCallback((e) => {
    setPageSize(parseInt(e.target.value));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handlePhaseChange = useCallback((e) => {
    setSelectedHeaterProfile(e.target.value);
  }, []);


  if (loading || !selectedFile) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          {!selectedFile ? 'Please select a VOC file...' : 'Loading Phase 2 Bio Lab Testing Data...'}
        </div>
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

  // Early return if no data
  if (!data || data.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>No data available</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <PerformanceIndicator />
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
           {availableFiles.length > 0 ? (
             <select 
               style={styles.select} 
               value={selectedFile} 
               onChange={handleFileChange}
               size="1"
             >
               {availableFiles.map(file => (
                 <option key={file} value={file}>{file}</option>
               ))}
             </select>
           ) : (
             <div style={{ color: '#fff', fontSize: '14px', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
               Loading available files...
             </div>
           )}
         </div>

        <div style={styles.downloadSection}>
          <button 
            style={styles.downloadButton}
            onClick={handleDownloadCSV}
          >
            📄 Download CSV
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div 
            style={hoveredStats.totalRecords ? { ...styles.statItem, ...styles.statItemHover } : styles.statItem}
            onMouseEnter={() => setHoveredStats(prev => ({ ...prev, totalRecords: true }))}
            onMouseLeave={() => setHoveredStats(prev => ({ ...prev, totalRecords: false }))}
          >
            <div style={styles.statValue}>{stats.totalRecords?.toLocaleString()}</div>
            <div style={styles.statLabel}>Total Records</div>
          </div>
          <div 
            style={hoveredStats.heaterProfiles ? { ...styles.statItem, ...styles.statItemHover } : styles.statItem}
            onMouseEnter={() => setHoveredStats(prev => ({ ...prev, heaterProfiles: true }))}
            onMouseLeave={() => setHoveredStats(prev => ({ ...prev, heaterProfiles: false }))}
          >
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
            onClick={() => handleTabChange('overview')}
          >
            📊 Overview
          </button>
          <button
            style={activeTab === 'profiles' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => handleTabChange('profiles')}
          >
            🔥 Heater Profiles
          </button>
          <button
            style={activeTab === 'phases' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => handleTabChange('phases')}
          >
            ⏱️ Phase Analysis
          </button>
          <button
            style={activeTab === 'charts' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => handleTabChange('charts')}
          >
            📈 Charts & Graphs
          </button>
          <button
            style={activeTab === 'csv' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => handleTabChange('csv')}
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
                 <div style={styles.statValue}>{data?.[0]?.VOC || 'Unknown'}</div>
                 <div style={styles.statLabel}>VOC Tested</div>
               </div>
             </div>
           </div>

           {/* Sensor Statistics Section */}
           <div style={styles.card}>
             <h2 style={styles.cardTitle}>📊 All Sensor Statistics (Max/Min/Avg)</h2>
             <div style={styles.sensorStatsGrid}>
               {['BME_HeaterRes', 'MQ136_RAW', 'MQ138_RAW', 'Alpha_PID', 'SPEC', 'SGP40_VOC'].map(sensor => {
                 const values = data.map(row => parseFloat(row[sensor] || 0)).filter(v => !isNaN(v));
                 const min = values.length > 0 ? Math.min(...values) : 0;
                 const max = values.length > 0 ? Math.max(...values) : 0;
                 const avg = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
                 
                 return (
                   <div 
                     key={sensor} 
                     style={hoveredSensors[sensor] ? { ...styles.sensorCard, ...styles.sensorCardHover } : styles.sensorCard}
                     onMouseEnter={() => setHoveredSensors(prev => ({ ...prev, [sensor]: true }))}
                     onMouseLeave={() => setHoveredSensors(prev => ({ ...prev, [sensor]: false }))}
                   >
                     <h3 style={styles.sensorCardTitle}>{sensor}</h3>
                     <div style={styles.sensorStatsRow}>
                       <div style={styles.sensorStatItem}>
                         <div style={styles.sensorStatLabel}>Max</div>
                         <div style={styles.sensorStatValue}>{max.toFixed(2)}</div>
                       </div>
                       <div style={styles.sensorStatItem}>
                         <div style={styles.sensorStatLabel}>Min</div>
                         <div style={styles.sensorStatValue}>{min.toFixed(2)}</div>
                       </div>
                       <div style={styles.sensorStatItem}>
                         <div style={styles.sensorStatLabel}>Avg</div>
                         <div style={styles.sensorStatValue}>{avg.toFixed(2)}</div>
                       </div>
                     </div>
                   </div>
                 );
               })}
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
                  <div 
                    key={profile} 
                    style={hoveredProfiles[profile] ? { ...styles.heaterProfileCard, ...styles.heaterProfileCardHover } : styles.heaterProfileCard}
                    onMouseEnter={() => setHoveredProfiles(prev => ({ ...prev, [profile]: true }))}
                    onMouseLeave={() => setHoveredProfiles(prev => ({ ...prev, [profile]: false }))}
                  >
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
             <h2 style={styles.cardTitle}>📈 Heater Profile Advanced Analytics & Visualizations</h2>
             
             {/* Heater Profile Selection */}
             <div style={styles.phaseSelector}>
               <label style={styles.phaseSelectorLabel}>Select Heater Profile:</label>
                               <select 
                  style={styles.phaseSelect} 
                  value={selectedHeaterProfile} 
                  onChange={handlePhaseChange}
                >
                 <option value="all">All Heater Profiles</option>
                 {Object.keys(stats.heaterProfiles || {}).map(profile => (
                   <option key={profile} value={profile}>Profile {profile}</option>
                 ))}
               </select>
             </div>

             {/* Bell Curves by Heater Profile and Phase */}
             <div style={styles.chartContainer}>
               <h3 style={{ color: '#fff', marginBottom: '15px' }}>🔔 Bell Curve Distributions by Heater Profile & Phase</h3>
               <div style={styles.chartGrid}>
                 {Object.keys(stats.heaterProfiles || {}).map(profile => {
                   if (selectedHeaterProfile !== 'all' && selectedHeaterProfile !== profile) return null;
                   
                   return ['Pre-Puff', 'Puff', 'Post-Puff'].map(phase => {
                     const curve = bellCurveData[profile]?.[phase];
                     
                     if (!curve) return null;
                     
                     return (
                       <MemoizedPlot
                         key={`${profile}-${phase}`}
                         data={[
                           {
                             x: curve.actualValues,
                             type: 'histogram',
                             name: 'Actual Data',
                             opacity: 0.7,
                             marker: { color: '#ff6b6b' },
                             nbinsx: 20,
                             yaxis: 'y'
                           },
                           {
                             x: curve.x,
                             y: curve.y,
                             type: 'scatter',
                             mode: 'lines',
                             name: 'Theoretical Normal',
                             line: { color: '#4fc3f7', width: 3 },
                             yaxis: 'y2'
                           }
                         ]}
                         layout={{
                           title: `🔔 Bell Curve: Profile ${profile} - ${phase} Phase (${stats.heaterProfiles[profile]?.phases[phase]?.count || 0} records)`,
                           paper_bgcolor: 'rgba(0,0,0,0)',
                           plot_bgcolor: 'rgba(0,0,0,0)',
                           font: { color: '#fff' },
                           xaxis: { title: 'BME Heater Resistance', gridcolor: 'rgba(255,255,255,0.1)' },
                           yaxis: { title: 'Frequency (Histogram)', gridcolor: 'rgba(255,255,255,0.1)', side: 'left' },
                           yaxis2: { title: 'Probability Density', gridcolor: 'rgba(255,255,255,0.1)', side: 'right', overlaying: 'y' },
                           showlegend: true,
                           legend: { font: { color: '#fff' } },
                           annotations: [
                             {
                               text: `Profile: ${profile}<br>Phase: ${phase}<br>Records: ${stats.heaterProfiles[profile]?.phases[phase]?.count || 0}`,
                               showarrow: false,
                               xref: 'paper',
                               yref: 'paper',
                               x: 0.02,
                               y: 0.98,
                               bgcolor: 'rgba(0,0,0,0.7)',
                               bordercolor: 'rgba(255,255,255,0.3)',
                               borderwidth: 1,
                               font: { color: '#fff', size: 12 }
                             }
                           ]
                         }}
                         style={{ width: '100%', height: '400px' }}
                         config={{ displayModeBar: false }}
                       />
                     );
                   });
                 })}
               </div>
             </div>

             {/* Box Plots by Heater Profile and Phase */}
             <div style={styles.chartContainer}>
               <h3 style={{ color: '#fff', marginBottom: '15px' }}>📦 Box Plots by Heater Profile & Phase</h3>
               {Object.keys(stats.heaterProfiles || {}).map(profile => {
                 if (selectedHeaterProfile !== 'all' && selectedHeaterProfile !== profile) return null;
                 
                 return (
                   <div key={profile} style={{ marginBottom: '30px' }}>
                     <h4 style={{ color: '#4fc3f7', marginBottom: '15px', textAlign: 'center' }}>Profile {profile}</h4>
                     <MemoizedPlot
                       data={[
                         {
                           y: data.filter(row => row.Heater_Profile === profile && row.Phase === 'Pre-Puff')
                             .map(row => parseFloat(row.BME_HeaterRes || 0)).filter(v => !isNaN(v)),
                           type: 'box',
                           name: 'Pre-Puff',
                           marker: { color: '#4fc3f7' }
                         },
                         {
                           y: data.filter(row => row.Heater_Profile === profile && row.Phase === 'Puff')
                             .map(row => parseFloat(row.BME_HeaterRes || 0)).filter(v => !isNaN(v)),
                           type: 'box',
                           name: 'Puff',
                           marker: { color: '#ff6b6b' }
                         },
                         {
                           y: data.filter(row => row.Heater_Profile === profile && row.Phase === 'Post-Puff')
                             .map(row => parseFloat(row.BME_HeaterRes || 0)).filter(v => !isNaN(v)),
                           type: 'box',
                           name: 'Post-Puff',
                           marker: { color: '#4caf50' }
                         }
                       ]}
                       layout={{
                         title: `📦 Box Plot: Profile ${profile} - BME Heater Resistance by Phase`,
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
                 );
               })}
             </div>

             {/* MQ Sensors Box Plots by Heater Profile */}
             <div style={styles.chartContainer}>
               <h3 style={{ color: '#fff', marginBottom: '15px' }}>📦 MQ Sensors by Heater Profile & Phase</h3>
               <div style={styles.chartGrid}>
                 {Object.keys(stats.heaterProfiles || {}).map(profile => {
                   if (selectedHeaterProfile !== 'all' && selectedHeaterProfile !== profile) return null;
                   
                   return (
                     <div key={profile}>
                       <h4 style={{ color: '#4fc3f7', marginBottom: '15px', textAlign: 'center' }}>Profile {profile}</h4>
                       <MemoizedPlot
                         data={[
                           {
                             y: data.filter(row => row.Heater_Profile === profile && row.Phase === 'Pre-Puff')
                               .map(row => parseFloat(row.MQ136_RAW || 0)).filter(v => !isNaN(v)),
                             type: 'box',
                             name: 'Pre-Puff',
                             marker: { color: '#4fc3f7' }
                           },
                           {
                             y: data.filter(row => row.Heater_Profile === profile && row.Phase === 'Puff')
                               .map(row => parseFloat(row.MQ136_RAW || 0)).filter(v => !isNaN(v)),
                             type: 'box',
                             name: 'Puff',
                             marker: { color: '#ff6b6b' }
                           },
                           {
                             y: data.filter(row => row.Heater_Profile === profile && row.Phase === 'Post-Puff')
                               .map(row => parseFloat(row.MQ136_RAW || 0)).filter(v => !isNaN(v)),
                             type: 'box',
                             name: 'Post-Puff',
                             marker: { color: '#4caf50' }
                           }
                         ]}
                         layout={{
                           title: `📦 Box Plot: Profile ${profile} - MQ136 Raw Values by Phase`,
                           paper_bgcolor: 'rgba(0,0,0,0)',
                           plot_bgcolor: 'rgba(0,0,0,0)',
                           font: { color: '#fff' },
                           yaxis: { title: 'MQ136 Raw Value', gridcolor: 'rgba(255,255,255,0.1)' },
                           showlegend: true,
                           legend: { font: { color: '#fff' } }
                         }}
                         style={{ width: '100%', height: '400px' }}
                         config={{ displayModeBar: false }}
                       />
                     </div>
                   );
                 })}
               </div>
             </div>

             {/* Heater Profile-wise Correlation Matrix */}
             <div style={styles.chartContainer}>
               <h3 style={{ color: '#fff', marginBottom: '15px' }}>🔗 Heater Profile-wise Sensor Correlation Matrix</h3>
               <div style={styles.chartGrid}>
                 {Object.keys(stats.heaterProfiles || {}).map(profile => {
                   if (selectedHeaterProfile !== 'all' && selectedHeaterProfile !== profile) return null;
                   
                   const profileCorrelation = correlationMatrices[profile];
                   if (!profileCorrelation) return null;
                   
                   return (
                     <MemoizedPlot
                       key={profile}
                       data={[
                         {
                           z: profileCorrelation.z,
                           x: profileCorrelation.x,
                           y: profileCorrelation.y,
                           type: 'heatmap',
                           colorscale: 'RdBu',
                           zmid: 0
                         }
                       ]}
                       layout={{
                         title: `🔗 Correlation Matrix: Profile ${profile} - Sensor Relationships`,
                         paper_bgcolor: 'rgba(0,0,0,0)',
                         plot_bgcolor: 'rgba(0,0,0,0)',
                         font: { color: '#fff' },
                         xaxis: { title: 'Sensors', gridcolor: 'rgba(255,255,255,0.1)' },
                         yaxis: { title: 'Sensors', gridcolor: 'rgba(255,255,255,0.1)' }
                       }}
                       style={{ width: '100%', height: '400px' }}
                       config={{ displayModeBar: false }}
                     />
                   );
                 })}
               </div>
             </div>

             {/* Time Series by Heater Profile and Phase */}
             <div style={styles.chartContainer}>
               <h3 style={{ color: '#fff', marginBottom: '15px' }}>⏰ Time Series Analysis by Heater Profile & Phase</h3>
               <div style={styles.chartGrid}>
                 {Object.keys(stats.heaterProfiles || {}).map(profile => {
                   if (selectedHeaterProfile !== 'all' && selectedHeaterProfile !== profile) return null;
                   
                   return ['Pre-Puff', 'Puff', 'Post-Puff'].map(phase => {
                     const profilePhaseData = data.filter(row => row.Heater_Profile === profile && row.Phase === phase);
                     
                     if (profilePhaseData.length === 0) return null;
                     
                     return (
                       <MemoizedPlot
                         key={`${profile}-${phase}`}
                         data={[
                           {
                             x: Array.from({ length: profilePhaseData.length }, (_, i) => i),
                             y: profilePhaseData.map(row => parseFloat(row.BME_HeaterRes || 0)),
                             type: 'scatter',
                             mode: 'lines',
                             name: 'BME Heater Resistance',
                             line: { color: '#4fc3f7', width: 2 }
                           },
                           {
                             x: Array.from({ length: profilePhaseData.length }, (_, i) => i),
                             y: profilePhaseData.map(row => parseFloat(row.MQ136_RAW || 0)),
                             type: 'scatter',
                             mode: 'lines',
                             name: 'MQ136 Raw',
                             line: { color: '#ff6b6b', width: 2 },
                             yaxis: 'y2'
                           }
                         ]}
                         layout={{
                           title: `⏰ Time Series: Profile ${profile} - ${phase} Phase (${profilePhaseData.length} records)`,
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
                     );
                   });
                 })}
               </div>
             </div>
           </div>
         </div>

        {/* CSV Viewer Tab */}
        <div style={activeTab === 'csv' ? styles.activeTabContent : styles.tabContent}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📊 Advanced CSV Data Viewer</h2>
            
            {/* Search and Filter Controls */}
            <div style={styles.csvControls}>
              <div style={styles.searchSection}>
                <input
                  type="text"
                  placeholder="Search in all columns..."
                  style={styles.searchInput}
                  onChange={handleSearchChange}
                />
                <div style={styles.searchInfo}>
                  Showing {filteredData.length} of {data.length} records
                </div>
              </div>
              
              <div style={styles.filterSection}>
                <select 
                  style={styles.filterSelect}
                  value={selectedColumn}
                  onChange={handleColumnChange}
                >
                  <option value="">All Columns</option>
                  {Object.keys(data[0] || {}).map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Filter by column value..."
                  style={styles.filterInput}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div style={styles.viewControls}>
                <label style={styles.viewLabel}>
                  Rows per page:
                  <select 
                    style={styles.pageSizeSelect}
                    value={pageSize}
                    onChange={handlePageSizeChange}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </label>
                <button 
                  style={styles.exportButton}
                  onClick={handleExportFilteredCSV}
                >
                  📄 Export Filtered Data
                </button>
              </div>
            </div>

            <div style={styles.csvViewer}>
              <table style={styles.csvTable}>
                <thead>
                  <tr>
                    {Object.keys(data[0] || {}).map((header, index) => (
                      <th 
                        key={index} 
                        style={styles.csvHeader}
                        onClick={() => handleSort(header)}
                      >
                        <div style={styles.headerContent}>
                          {header}
                          <span style={styles.sortIcon}>
                            {sortColumn === header ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, rowIndex) => (
                    <tr key={rowIndex} style={styles.csvRow}>
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex} style={styles.csvCell}>
                          <div style={styles.cellContent}>
                            {typeof value === 'number' ? value.toFixed(2) : value}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination Controls */}
              <div style={styles.paginationSection}>
                <div style={styles.paginationControls}>
                  <button 
                    style={styles.paginationButton}
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  
                  <div style={styles.pageInfo}>
                    Page {currentPage} of {paginationData.totalPages} 
                    ({((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length})
                  </div>
                  
                  <button 
                    style={styles.paginationButton}
                    onClick={() => handlePageChange(Math.min(paginationData.totalPages, currentPage + 1))}
                    disabled={currentPage === paginationData.totalPages}
                  >
                    Next →
                  </button>
                </div>
              </div>
              
              {/* Data Summary */}
              <div style={styles.dataSummary}>
                <h4 style={styles.summaryTitle}>📈 Data Summary</h4>
                <div style={styles.summaryGrid}>
                  <div style={styles.summaryItem}>
                    <div style={styles.summaryValue}>{data.length}</div>
                    <div style={styles.summaryLabel}>Total Records</div>
                  </div>
                  <div style={styles.summaryItem}>
                    <div style={styles.summaryValue}>{Object.keys(data[0] || {}).length}</div>
                    <div style={styles.summaryLabel}>Columns</div>
                  </div>
                  <div style={styles.summaryItem}>
                    <div style={styles.summaryValue}>{filteredData.length}</div>
                    <div style={styles.summaryLabel}>Filtered Records</div>
                  </div>
                  <div style={styles.summaryItem}>
                    <div style={styles.summaryValue}>{selectedFile}</div>
                    <div style={styles.summaryLabel}>File Name</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 