// Configuration file for the application
const config = {
  // Backend URL - change this for different environments
  backendURL: process.env.NODE_ENV === 'production' 
    ? 'https://knosegit-backend.onrender.com' 
    : '',
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // API endpoints
  endpoints: {
    baseline: '/api/baseline-file',
    phase2: '/Phase2',
    files: '/api/files',
    phase2Files: '/api/phase2-files'
  }
};

export default config;
