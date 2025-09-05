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
  schematicSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
  },
  schematicButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  schematicButtonActive: {
    background: 'rgba(0, 200, 255, 0.3)',
    border: '1px solid rgba(0, 200, 255, 0.5)',
    transform: 'scale(1.05)',
  },
  pdfContainer: {
    width: '100%',
    height: '600px',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    background: '#fff',
    marginBottom: '20px',
  },
  pdfViewer: {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px',
  },
  infoPanel: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '20px',
  },
  infoTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '15px',
    color: '#fff',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  infoItem: {
    background: 'rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '5px',
  },
  infoValue: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#fff',
  },
  description: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
};

const SchematicDesign = () => {
  const navigate = useNavigate();
  const [selectedSchematic, setSelectedSchematic] = useState('BMC');
  const [backButtonHover, setBackButtonHover] = useState(false);

  const schematics = [
    {
      id: 'BMC',
      name: 'BMC Baseline Schematic',
      filename: 'Schematic_BMC knose.pdf',
      description: 'Main BMC controller schematic'
    },
    {
      id: 'BME688',
      name: 'BME688 Sensor',
      filename: 'Schematic_BME688 knose.pdf',
      description: 'BME688 sensor schematic'
    },
    {
      id: 'MQ136',
      name: 'MQ136 Schematic',
      filename: 'Schematic_MQ136 knose.pdf',
      description: 'MQ136 sensor schematic'
    },
    {
      id: 'MQ138',
      name: 'MQ138 Schematic',
      filename: 'Schematic_MQ138 Knose.pdf',
      description: 'MQ138 sensor schematic'
    },
    {
      id: 'SGP40',
      name: 'SGP40 Schematic',
      filename: 'Schematic_SGP40 knose.pdf',
      description: 'SGP40 sensor schematic'
    }
  ];

  const selectedSchematicData = schematics.find(s => s.id === selectedSchematic);

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
        <h2 style={styles.title}>🔧 Schematic Design - VOC Detection System</h2>
        
        {/* Schematic Selector */}
        <div style={styles.schematicSelector}>
          {schematics.map((schematic) => (
            <button
              key={schematic.id}
              style={selectedSchematic === schematic.id ? 
                { ...styles.schematicButton, ...styles.schematicButtonActive } : 
                styles.schematicButton
              }
              onClick={() => setSelectedSchematic(schematic.id)}
            >
              {schematic.name}
            </button>
          ))}
        </div>

        {/* Description */}
        <div style={styles.description}>
          {selectedSchematicData?.description}
        </div>

        {/* PDF Viewer */}
        <div style={styles.pdfContainer}>
          <iframe
            src={`/IndipendentSchematics/${selectedSchematicData?.filename}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            style={styles.pdfViewer}
            title={`${selectedSchematicData?.name} Schematic`}
          />
        </div>

        {/* System Overview */}
        <div style={styles.infoPanel}>
          <h3 style={styles.infoTitle}>Available Schematics</h3>
          <div style={styles.infoGrid}>
            {schematics.map((schematic) => (
              <div key={schematic.id} style={styles.infoItem}>
                <div style={styles.infoLabel}>{schematic.name}</div>
                <div style={styles.infoValue}>{schematic.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchematicDesign;