// Production serves the frontend and API together on Vercel.
// Ignore any old Railway URL left in the hosting project's environment.
let rawUrl = import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL;

if (!rawUrl) {
  rawUrl = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
    ? ''
    : 'http://localhost:5000';
} else {
  rawUrl = rawUrl.trim();
  if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
    rawUrl = `https://${rawUrl}`;
  }
}

const API_BASE_URL = rawUrl;
export default API_BASE_URL;
