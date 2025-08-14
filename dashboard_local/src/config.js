// Configuration file for the application
const config = {
  backendURL: process.env.NODE_ENV === 'production'
    ? 'https://knosegit-backend.onrender.com'
    : 'http://localhost:4000',
  environment: process.env.NODE_ENV || 'development',
  endpoints: {
    baseline: '/api/baseline-file',
    phase2: '/Phase2',
    files: '/api/files',
    phase2Files: '/api/phase2-files'
  },
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  useCorsProxy: false // Disable CORS proxy nonsense
};

export default config;
