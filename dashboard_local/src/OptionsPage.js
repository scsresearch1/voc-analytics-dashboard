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
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    width: '100%',
  },
  optionCard: {
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(12px)',
    border: '1.5px solid rgba(255,255,255,0.25)',
    padding: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: '200px',
  },
  optionCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.45)',
    border: '1.5px solid rgba(255,255,255,0.4)',
  },
  optionIcon: {
    fontSize: '3rem',
    marginBottom: '20px',
    display: 'block',
  },
  optionTitle: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '15px',
    letterSpacing: '1px',
  },
  optionDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1rem',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  comingSoon: {
    color: '#ffd700',
    fontSize: '1.1rem',
    fontWeight: 600,
    fontStyle: 'italic',
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
};

export default function OptionsPage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = React.useState(null);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleOptionClick = (option) => {
    switch (option) {
      case 'data-format':
        // Navigate to data format page (to be implemented)
        navigate('/data-format');
        break;
      case 'baseline':
        // Navigate to baseline dashboard
        navigate('/baseline-dashboard');
        break;
      case 'phase1':
        // Navigate to existing dashboard
        navigate('/dashboard');
        break;
      case 'phase2':
        // Navigate to Phase 2 dashboard
        navigate('/phase2-dashboard');
        break;
      case 'phase3':
        // Show coming soon message
        alert('Phase 3 Path Lab Testing - Coming Soon!');
        break;
      default:
        break;
    }
  };

  const options = [
    {
      id: 'data-format',
      title: 'Data Format',
      description: 'View data format specifications and legends with detailed explanations.',
      icon: '📊',
      comingSoon: false,
    },
    {
      id: 'baseline',
      title: 'Baseline Values',
      description: 'Comprehensive baseline sensor data analysis with scientific visualizations and download options.',
      icon: '📈',
      comingSoon: false,
    },
    {
      id: 'phase1',
      title: 'Phase 1 Bio Lab Testing',
      description: 'Access the existing VOC analytics dashboard with sensor data visualization.',
      icon: '🧪',
      comingSoon: false,
    },
    {
      id: 'phase2',
      title: 'Phase 2 Bio Lab Testing',
      description: 'Advanced bio lab testing dashboard with enhanced analytics features.',
      icon: '🔬',
      comingSoon: false,
    },
    {
      id: 'phase3',
      title: 'Phase 3 Path Lab Testing',
      description: 'Comprehensive path lab testing dashboard with full diagnostic capabilities.',
      icon: '🏥',
      comingSoon: true,
    },
  ];

  return (
    <div style={styles.container}>
      <button
        style={hoveredCard === 'logout' ? { ...styles.logoutButton, ...styles.logoutButtonHover } : styles.logoutButton}
        onClick={handleLogout}
        onMouseEnter={() => setHoveredCard('logout')}
        onMouseLeave={() => setHoveredCard(null)}
      >
        Logout
      </button>
      
      <h1 style={styles.header}>VOC Analytics Platform</h1>
      
      <div style={styles.optionsGrid}>
        {options.map((option) => (
          <div
            key={option.id}
            style={hoveredCard === option.id ? { ...styles.optionCard, ...styles.optionCardHover } : styles.optionCard}
            onClick={() => handleOptionClick(option.id)}
            onMouseEnter={() => setHoveredCard(option.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <span style={styles.optionIcon} role="img" aria-label={option.title}>
              {option.icon}
            </span>
            <h2 style={styles.optionTitle}>{option.title}</h2>
            <p style={styles.optionDescription}>{option.description}</p>
            {option.comingSoon && (
              <div style={styles.comingSoon}>Coming Soon!</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 