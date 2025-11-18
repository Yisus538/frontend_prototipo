export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ROUTES = {
    login: `${API_BASE_URL}/api/auth/login`,
    noAutorizados: `${API_BASE_URL}/api/no-autorizados`,
    moradores: `${API_BASE_URL}/api/moradores`,
    visitas: `${API_BASE_URL}/api/visitas`,
    tarjetas: `${API_BASE_URL}/api/tarjetas`
};