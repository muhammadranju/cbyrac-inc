const isLocal = window.location.hostname === "localhost";

const VITE_BASE_URL = isLocal
  ? import.meta.env.VITE_LOCAL_BASE_URL
  : import.meta.env.VITE_LIVE_BASE_URL;

const VITE_BASE_API = isLocal
  ? import.meta.env.VITE_LOCAL_BASE_API
  : import.meta.env.VITE_LIVE_BASE_API;

export { VITE_BASE_URL, VITE_BASE_API };
