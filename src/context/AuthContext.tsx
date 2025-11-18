import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Usuario } from '../App'; // Reutilizamos la interfaz que ya tienes en App.tsx

// Definimos qué funciones y datos exporta nuestro contexto
interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: Usuario | null;
    login: (token: string, userData: Usuario) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Estado para saber si ya cargó localStorage

    // Al iniciar la app, verificamos si ya hay un token guardado
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error al cargar datos de localStorage", error);
        } finally {
            setIsLoading(false); // Terminamos de cargar
        }
    }, []);

    const login = (newToken: string, userData: Usuario) => {
        // 1. Actualizamos el estado
        setToken(newToken);
        setUser(userData);

        // 2. Guardamos en localStorage (persistencia)
        try {
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error("Error al guardar en localStorage", error);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error("Error al limpiar localStorage", error);
        }
    };

    // Calculamos si está autenticado basándonos en si existe el token
    const isAuthenticated = !!token;

    // No renderizamos nada hasta saber si estamos logueados o no
    if (isLoading) {
        return null; // O un spinner de carga global
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};