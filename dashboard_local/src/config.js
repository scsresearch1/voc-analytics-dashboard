// Configuration file for the application
const config = {
  backendURL: process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production'
    ? 'https://voc-analytics-dashboard.onrender.com'
    : 'http://localhost:4000'),
  environment: process.env.NODE_ENV || 'development',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  endpoints: {
    baseline: '/api/baseline-file',
    phase2: '/api/phase2-file',
    files: '/api/file',
    phase2Files: '/api/phase2-files'
  },
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  useCorsProxy: false // Disable CORS proxy nonsense
};

export default config;
