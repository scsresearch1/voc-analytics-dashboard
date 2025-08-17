import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    padding: '40px 20px',
    color: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: '20px',
    textShadow: '0 2px 8px rgba(0,0,0,0.10)',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '30px',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
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
  logoutButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
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
  logoutButtonHover: {
    background: 'rgba(255,255,255,0.3)',
    transform: 'scale(1.05)',
  },
  content: {
    maxWidth: '1600px',
    margin: '0 auto',
  },
  section: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '30px',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: '20px',
    color: '#90caf9',
    textAlign: 'center',
  },
  selectionSection: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '30px',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  selectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  hpCheckbox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  hpCheckboxHover: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.4)',
  },
  hpCheckboxSelected: {
    background: 'rgba(144, 202, 249, 0.3)',
    border: '1px solid #90caf9',
  },
  checkbox: {
    marginRight: '10px',
    transform: 'scale(1.2)',
  },
  hpLabel: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
  },
  detailsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '30px',
  },
  selectedProfilesSection: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  excelDataSection: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  selectedProfilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  profileCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
  },
  profileCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.4)',
  },
  profileImage: {
    width: '100%',
    maxWidth: '250px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  profileName: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#90caf9',
    marginBottom: '15px',
  },
  profileDetails: {
    textAlign: 'left',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    padding: '5px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  detailLabel: {
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
  },
  detailValue: {
    color: '#fff',
  },
  excelTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  excelTableHeader: {
    background: 'rgba(144, 202, 249, 0.2)',
    color: '#90caf9',
    fontWeight: 600,
    padding: '12px 8px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  excelTableCell: {
    padding: '10px 8px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.9rem',
  },
  excelTableRow: {
    transition: 'background 0.2s ease',
  },
  excelTableRowHover: {
    background: 'rgba(255,255,255,0.05)',
  },
  noSelection: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },
  researchDetails: {
    lineHeight: '1.6',
    fontSize: '1.1rem',
  },
  researchList: {
    marginLeft: '30px',
    marginTop: '15px',
    marginBottom: '20px',
  },
  researchListItem: {
    marginBottom: '8px',
  },
  downloadButton: {
    display: 'inline-block',
    padding: '15px 30px',
    background: 'linear-gradient(90deg, #1976d2, #43a047)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    marginTop: '20px',
  },
  downloadButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
  },
  loadingMessage: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#90caf9',
    fontStyle: 'italic',
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#ff6b6b',
    fontStyle: 'italic',
  },
};

export default function BME688Research() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [selectedHPs, setSelectedHPs] = useState(new Set());
  const [hpData, setHpData] = useState({});
  const [excelData, setExcelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data structure for HP details (fallback if Excel fails)
  const heaterProfiles = [
    { name: 'HP-001', image: '/BME688_Research/HP-001.png' },
    { name: 'HP-301', image: '/BME688_Research/HP-301.png' },
    { name: 'HP-321', image: '/BME688_Research/HP-321.png' },
    { name: 'HP-322', image: '/BME688_Research/HP-322.png' },
    { name: 'HP-323', image: '/BME688_Research/HP-323.png' },
    { name: 'HP-324', image: '/BME688_Research/HP-324.png' },
    { name: 'HP-331', image: '/BME688_Research/HP-331.png' },
    { name: 'HP-332', image: '/BME688_Research/HP-332.png' },
    { name: 'HP-354', image: '/BME688_Research/HP-354.png' },
    { name: 'HP-411', image: '/BME688_Research/HP-411.png' },
    { name: 'HP-412', image: '/BME688_Research/HP-412.png' },
    { name: 'HP-413', image: '/BME688_Research/HP-413.png' },
    { name: 'HP-414', image: '/BME688_Research/HP-414.png' },
    { name: 'HP-501', image: '/BME688_Research/HP-501.png' },
    { name: 'HP-502', image: '/BME688_Research/HP-502.png' },
    { name: 'HP-503', image: '/BME688_Research/HP-503.png' },
    { name: 'HP-504', image: '/BME688_Research/HP-504.png' },
  ];

  // Mock HP data - fallback if Excel fails
  const mockHpData = {
    'HP-001': {
      temperature: '200°C',
      rampRate: '2°C/s',
      holdTime: '30s',
      powerConsumption: '45mW',
      sensitivity: 'High',
      selectivity: 'Medium',
      notes: 'Standard profile for general VOC detection'
    },
    'HP-301': {
      temperature: '250°C',
      rampRate: '3°C/s',
      holdTime: '45s',
      powerConsumption: '52mW',
      sensitivity: 'Very High',
      selectivity: 'High',
      notes: 'Optimized for ammonia detection'
    },
    'HP-321': {
      temperature: '180°C',
      rampRate: '1.5°C/s',
      holdTime: '60s',
      powerConsumption: '38mW',
      sensitivity: 'Medium',
      selectivity: 'Very High',
      notes: 'Low power consumption profile'
    },
    'HP-322': {
      temperature: '220°C',
      rampRate: '2.5°C/s',
      holdTime: '40s',
      powerConsumption: '48mW',
      sensitivity: 'High',
      selectivity: 'High',
      notes: 'Balanced performance profile'
    },
    'HP-323': {
      temperature: '240°C',
      rampRate: '3.5°C/s',
      holdTime: '35s',
      powerConsumption: '55mW',
      sensitivity: 'Very High',
      selectivity: 'Medium',
      notes: 'High temperature profile for complex VOCs'
    },
    'HP-324': {
      temperature: '190°C',
      rampRate: '2°C/s',
      holdTime: '50s',
      powerConsumption: '42mW',
      sensitivity: 'Medium',
      selectivity: 'Very High',
      notes: 'Selective detection profile'
    },
    'HP-331': {
      temperature: '210°C',
      rampRate: '2.2°C/s',
      holdTime: '55s',
      powerConsumption: '46mW',
      sensitivity: 'High',
      selectivity: 'High',
      notes: 'Enhanced selectivity profile'
    },
    'HP-332': {
      temperature: '230°C',
      rampRate: '2.8°C/s',
      holdTime: '38s',
      powerConsumption: '51mW',
      sensitivity: 'Very High',
      selectivity: 'Medium',
      notes: 'High sensitivity profile'
    },
    'HP-354': {
      temperature: '175°C',
      rampRate: '1.8°C/s',
      holdTime: '65s',
      powerConsumption: '36mW',
      sensitivity: 'Medium',
      selectivity: 'Very High',
      notes: 'Ultra-low power profile'
    },
    'HP-411': {
      temperature: '260°C',
      rampRate: '4°C/s',
      holdTime: '30s',
      powerConsumption: '58mW',
      sensitivity: 'Very High',
      selectivity: 'Low',
      notes: 'Maximum sensitivity profile'
    },
    'HP-412': {
      temperature: '245°C',
      rampRate: '3.2°C/s',
      holdTime: '42s',
      powerConsumption: '54mW',
      sensitivity: 'Very High',
      selectivity: 'Medium',
      notes: 'High performance profile'
    },
    'HP-413': {
      temperature: '235°C',
      rampRate: '2.9°C/s',
      holdTime: '45s',
      powerConsumption: '52mW',
      sensitivity: 'High',
      selectivity: 'High',
      notes: 'Balanced high performance'
    },
    'HP-414': {
      temperature: '255°C',
      rampRate: '3.8°C/s',
      holdTime: '32s',
      powerConsumption: '57mW',
      sensitivity: 'Very High',
      selectivity: 'Low',
      notes: 'Maximum detection range'
    },
    'HP-501': {
      temperature: '200°C',
      rampRate: '2.1°C/s',
      holdTime: '48s',
      powerConsumption: '44mW',
      sensitivity: 'High',
      selectivity: 'High',
      notes: 'Standard optimized profile'
    },
    'HP-502': {
      temperature: '225°C',
      rampRate: '2.7°C/s',
      holdTime: '41s',
      powerConsumption: '49mW',
      sensitivity: 'High',
      selectivity: 'Medium',
      notes: 'Enhanced detection profile'
    },
    'HP-503': {
      temperature: '215°C',
      rampRate: '2.3°C/s',
      holdTime: '52s',
      powerConsumption: '47mW',
      sensitivity: 'High',
      selectivity: 'High',
      notes: 'Selective detection optimized'
    },
    'HP-504': {
      temperature: '235°C',
      rampRate: '3.1°C/s',
      holdTime: '39s',
      powerConsumption: '53mW',
      sensitivity: 'Very High',
      selectivity: 'Medium',
      notes: 'High performance optimized'
    }
  };

  const loadExcelData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch the Excel file
      const response = await fetch('/BME688_Research/BME 688 HP Details.xlsx');
      if (!response.ok) {
        throw new Error('Excel file not found');
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length > 0) {
        setExcelData(jsonData);
        // Try to extract HP data from Excel
        const extractedHpData = extractHpDataFromExcel(jsonData);
        if (Object.keys(extractedHpData).length > 0) {
          setHpData(extractedHpData);
        } else {
          setHpData(mockHpData);
        }
      } else {
        setHpData(mockHpData);
      }
    } catch (err) {
      console.error('Error loading Excel data:', err);
      setError('Failed to load Excel data. Using mock data instead.');
      setHpData(mockHpData);
    } finally {
      setLoading(false);
    }
  }, [mockHpData]);

  useEffect(() => {
    loadExcelData();
  }, [loadExcelData]);



  const extractHpDataFromExcel = (jsonData) => {
    const hpData = {};
    
    if (jsonData.length < 2) return hpData;
    
    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);
    
    // Find relevant column indices
    const hpIndex = headers.findIndex(h => 
      h && typeof h === 'string' && h.toLowerCase().includes('heater') && h.toLowerCase().includes('profile')
    );
    const tempIndex = headers.findIndex(h => 
      h && typeof h === 'string' && h.toLowerCase().includes('temp')
    );
    const rampIndex = headers.findIndex(h => 
      h && typeof h === 'string' && h.toLowerCase().includes('ramp')
    );
    const holdIndex = headers.findIndex(h => 
      h && typeof h === 'string' && h.toLowerCase().includes('hold')
    );
    const powerIndex = headers.findIndex(h => 
      h && typeof h === 'string' && h.toLowerCase().includes('power')
    );
    const sensitivityIndex = headers.findIndex(h => 
      h && typeof h === 'string' && h.toLowerCase().includes('sensitivity')
    );
    const selectivityIndex = headers.findIndex(h => 
      h && typeof h === 'string' && h.toLowerCase().includes('selectivity')
    );
    const notesIndex = headers.findIndex(h => 
      h && typeof h === 'string' && h.toLowerCase().includes('note')
    );
    
    dataRows.forEach(row => {
      if (row[hpIndex] && typeof row[hpIndex] === 'string' && row[hpIndex].includes('HP-')) {
        const hpName = row[hpIndex].trim();
        hpData[hpName] = {
          temperature: row[tempIndex] ? `${row[tempIndex]}°C` : 'N/A',
          rampRate: row[rampIndex] ? `${row[rampIndex]}°C/s` : 'N/A',
          holdTime: row[holdIndex] ? `${row[holdIndex]}s` : 'N/A',
          powerConsumption: row[powerIndex] ? `${row[powerIndex]}mW` : 'N/A',
          sensitivity: row[sensitivityIndex] || 'N/A',
          selectivity: row[selectivityIndex] || 'N/A',
          notes: row[notesIndex] || 'No additional notes'
        };
      }
    });
    
    return hpData;
  };

  const handleBack = () => {
    navigate('/options');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleHPSelection = (hpName) => {
    const newSelection = new Set(selectedHPs);
    if (newSelection.has(hpName)) {
      newSelection.delete(hpName);
    } else {
      newSelection.add(hpName);
    }
    setSelectedHPs(newSelection);
  };

  const isHPSelected = (hpName) => selectedHPs.has(hpName);

  const getSelectedHPData = () => {
    return Array.from(selectedHPs).map(hpName => ({
      name: hpName,
      image: heaterProfiles.find(hp => hp.name === hpName)?.image,
      data: hpData[hpName]
    }));
  };

  const renderExcelTable = () => {
    if (!excelData || excelData.length === 0) {
      return <div style={styles.noSelection}>No Excel data available</div>;
    }

    // Filter Excel data to show only selected HPs
    const selectedHPNames = Array.from(selectedHPs);
    const filteredData = excelData.filter(row => {
      if (row.length === 0) return false;
      const firstCell = row[0];
      return firstCell && typeof firstCell === 'string' && 
             selectedHPNames.some(hpName => firstCell.includes(hpName));
    });

    if (filteredData.length === 0) {
      return <div style={styles.noSelection}>No data found for selected heater profiles</div>;
    }

    const headers = excelData[0];
    const dataRows = filteredData;

    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.excelTable}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} style={styles.excelTableHeader}>
                  {header || `Column ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                style={styles.excelTableRow}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={styles.excelTableCell}>
                    {cell || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'center', marginTop: '15px', color: 'rgba(255,255,255,0.7)' }}>
          Showing data for {selectedHPNames.length} selected heater profile(s)
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <button
        style={hoveredButton === 'back' ? { ...styles.backButton, ...styles.backButtonHover } : styles.backButton}
        onClick={handleBack}
        onMouseEnter={() => setHoveredButton('back')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        ← Back
      </button>
      
      <button
        style={hoveredButton === 'logout' ? { ...styles.logoutButton, ...styles.logoutButtonHover } : styles.logoutButton}
        onClick={handleLogout}
        onMouseEnter={() => setHoveredButton('logout')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        Logout
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>BME 688 Research Data</h1>
        <p style={styles.subtitle}>Advanced sensor research and heater profile optimization</p>
      </div>

      <div style={styles.content}>
        {/* HP Selection Section */}
        <div style={styles.selectionSection}>
          <h2 style={styles.sectionTitle}>Select Heater Profiles to View Details</h2>
          <div style={styles.selectionGrid}>
            {heaterProfiles.map((profile) => (
              <div
                key={profile.name}
                style={{
                  ...styles.hpCheckbox,
                  ...(isHPSelected(profile.name) ? styles.hpCheckboxSelected : {}),
                  ...(hoveredCard === profile.name ? styles.hpCheckboxHover : {})
                }}
                onClick={() => toggleHPSelection(profile.name)}
                onMouseEnter={() => setHoveredCard(profile.name)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <input
                  type="checkbox"
                  checked={isHPSelected(profile.name)}
                  onChange={() => toggleHPSelection(profile.name)}
                  style={styles.checkbox}
                />
                <label style={styles.hpLabel}>{profile.name}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Selected HP Details and Excel Data Side by Side */}
        {selectedHPs.size > 0 && (
          <div style={styles.detailsContainer}>
            {/* Selected HP Details Section */}
            <div style={styles.selectedProfilesSection}>
              <h2 style={styles.sectionTitle}>Selected Heater Profile Details</h2>
              <div style={styles.selectedProfilesGrid}>
                {getSelectedHPData().map((profile) => (
                  <div
                    key={profile.name}
                    style={hoveredCard === profile.name ? { ...styles.profileCard, ...styles.profileCardHover } : styles.profileCard}
                    onMouseEnter={() => setHoveredCard(profile.name)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      style={styles.profileImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none', fontSize: '3rem', marginBottom: '10px' }}>🔬</div>
                    
                    <h3 style={styles.profileName}>{profile.name}</h3>
                    
                    <div style={styles.profileDetails}>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Temperature:</span>
                        <span style={styles.detailValue}>{profile.data.temperature}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Ramp Rate:</span>
                        <span style={styles.detailValue}>{profile.data.rampRate}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Hold Time:</span>
                        <span style={styles.detailValue}>{profile.data.holdTime}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Power:</span>
                        <span style={styles.detailValue}>{profile.data.powerConsumption}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Sensitivity:</span>
                        <span style={styles.detailValue}>{profile.data.sensitivity}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Selectivity:</span>
                        <span style={styles.detailValue}>{profile.data.selectivity}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Notes:</span>
                        <span style={styles.detailValue}>{profile.data.notes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Excel Data Section */}
            <div style={styles.excelDataSection}>
              <h2 style={styles.sectionTitle}>Heater Step Information</h2>
              {loading ? (
                <div style={styles.loadingMessage}>Loading Excel data...</div>
              ) : error ? (
                <div style={styles.errorMessage}>{error}</div>
              ) : (
                renderExcelTable()
              )}
            </div>
          </div>
        )}

        {/* No Selection Message */}
        {selectedHPs.size === 0 && (
          <div style={styles.section}>
            <div style={styles.noSelection}>
              Select one or more heater profiles above to view detailed information and specifications.
            </div>
          </div>
        )}

        {/* Research Overview Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Research Overview</h2>
          <div style={styles.researchDetails}>
            <p>
              The BME 688 sensor research focuses on optimizing heater profiles for enhanced gas detection sensitivity and selectivity. 
              Different heater profiles (HP-001 through HP-504) are tested to determine optimal operating conditions for various volatile organic compounds (VOCs).
            </p>
            <p>
              Each heater profile represents a specific temperature ramp and hold pattern designed to:
            </p>
            <ul style={styles.researchList}>
              <li style={styles.researchListItem}>Maximize sensor response to target gases</li>
              <li style={styles.researchListItem}>Minimize cross-sensitivity to interfering compounds</li>
              <li style={styles.researchListItem}>Optimize power consumption and sensor lifetime</li>
              <li style={styles.researchListItem}>Provide consistent and reproducible measurements</li>
            </ul>
            <p>
              This research is crucial for developing reliable gas detection systems that can accurately identify and quantify 
              specific VOCs in various environmental and industrial applications.
            </p>
          </div>
        </div>

        {/* Download Resources Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Download Resources</h2>
          <div style={styles.researchDetails}>
            <p>
              Access detailed specifications, technical documentation, and research findings for all heater profiles.
            </p>
            <a
              href="/BME688_Research/BME 688 HP Details.xlsx"
              download
              style={hoveredButton === 'download' ? { ...styles.downloadButton, ...styles.downloadButtonHover } : styles.downloadButton}
              onMouseEnter={() => setHoveredButton('download')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              📥 Download Detailed Specifications
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
