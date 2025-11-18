import type { Usuario, Vista } from "./app.interface";

export interface DashboardPageProps {
  onLogout: () => void;
  usuario: Usuario;
  onNavegar: (vista: Vista) => void;
}