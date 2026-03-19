// API Base URL — uses VITE_API_URL environment variable in production,
// falls back to localhost:5001 for local development
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default API_BASE;
