import axios from 'axios';

// Cambia esta URL si tu backend corre en otro host/puerto,
// o define VITE_API_BASE_URL en un archivo .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adjunta el token JWT guardado a cada petición saliente
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('agendaflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token venció o es inválido, limpia sesión y manda al login.
// Se registra un callback desde AuthContext para evitar import circular.
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

// El backend siempre responde { success:false, error: { code, message, details } }
// en caso de error (incluyendo errores de validación de Zod, con `details`
// como un array de issues). Esta función extrae un mensaje legible para toasts.
export const getErrorMessage = (error, fallback = 'Ocurrió un error inesperado') => {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;

  const apiError = data.error;
  if (apiError?.message) {
    // Si es un error de validación (Zod), agrega el primer detalle de campo
    // para que sea más accionable que solo "Datos inválidos".
    const firstIssue = Array.isArray(apiError.details) ? apiError.details[0] : null;
    if (firstIssue?.message && firstIssue.message !== apiError.message) {
      return `${apiError.message} (${firstIssue.message})`;
    }
    return apiError.message;
  }

  return data.message || fallback;
};

// El backend siempre responde { success: true, data: ... } en las rutas
// exitosas. Esta función extrae directamente el payload útil.
export const unwrap = (response) => response.data?.data;

export default client;
