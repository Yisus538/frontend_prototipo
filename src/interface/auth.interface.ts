import type { Usuario } from "./app.interface";

export interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: Usuario | null;
    login: (token: string, userData: Usuario) => void;
    logout: () => void;
}