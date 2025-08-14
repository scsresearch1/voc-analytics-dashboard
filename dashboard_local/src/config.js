// Configuration file for the application
const config = {
  // Backend URL - change this for different environments
  backendURL: process.env.NODE_ENV === 'production' 
    ? 'https://knosegit-backend.onrender.com' 
    : 'http://localhost:4000',
  // Fallback proxy service for CORS issues
  fallbackProxy: 'https://cors-anywhere.herokuapp.com/https://knosegit-backend.onrender.com',
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // API endpoints
  endpoints: {
    baseline: '/api/baseline-file',
    phase2: '/Phase2',
    files: '/api/files',
    phase2Files: '/api/phase2-files'
  },
  
  // Timeout settings
  timeout: 30000, // 30 seconds
  
  // Retry settings
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  useFallbackProxy: false // Set to true if CORS continues to fail
};

export default config;
