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
    maxWidth: '1000px',
    width: '100%',
    color: '#fff',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: '15px',
    color: '#fff',
    borderBottom: '2px solid rgba(255,255,255,0.3)',
    paddingBottom: '10px',
  },
  sectionContent: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(255,255,255,0.9)',
  },
  placeholder: {
    fontSize: '1.2rem',
    color: '#ffd700',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '40px',
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
};

export default function DataFormat() {
  const navigate = useNavigate();
  const [hovered, setHovered] = React.useState(false);

  const handleBack = () => {
    navigate('/options');
  };

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
          <h2 style={styles.sectionTitle}>Data Format Specifications</h2>
          <div style={styles.sectionContent}>
            <p>
              This section will contain detailed information about the data format used in the VOC analytics platform.
              The specifications will include file formats, data structure, and field descriptions.
            </p>
          </div>
        </div>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Legends & Explanations</h2>
          <div style={styles.sectionContent}>
            <p>
              This section will contain comprehensive legends and explanations for all data visualizations,
              sensor readings, and analytical components used throughout the platform.
            </p>
          </div>
        </div>
        
        <div style={styles.placeholder}>
          <p>📋 Legends and explanations will be added here in the next update.</p>
          <p>Please provide the detailed legends and explanations for the data format.</p>
        </div>
      </div>
    </div>
  );
} 