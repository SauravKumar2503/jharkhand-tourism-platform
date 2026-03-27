// API Base URL — uses VITE_API_URL environment variable in production,
// falls back to localhost:5001 for local development
const API_BASE = import.meta.env.VITE_API_URL || 'https://jharkhand-tourism-platform.onrender.com';

export default API_BASE;
