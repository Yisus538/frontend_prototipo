import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Usuario } from '../interface/app.interface';
import type { AuthContextType } from '../interface/auth.interface';



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true); 

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
            setIsLoading(false); 
        }
    }, []);

    const login = (newToken: string, userData: Usuario) => {
        
        setToken(newToken);
        setUser(userData);

        
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

   
    const isAuthenticated = !!token;

    if (isLoading) return null; 
    

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};