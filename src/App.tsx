import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { RegistrarTarjetaPage } from './RegistrarTarjetaPage';
import { ConsultarNoAutorizadoPage } from './ConsultarNoAutorizadosPage';
import { RegistrarVisitaPage } from './RegistrarVisitaPage';
import { RegistrarNoAutorizadoPage } from './RegistrarNoAutorizadoPage';
import { useAuth } from './context/AuthContext'; // <-- 1. Importar el Hook
import { RegistrarMoradorPage } from './RegistrarMoradorPage';

// --- INTERFACES GLOBALES ---
// (Estas interfaces deberían moverse a un archivo propio, ej: 'types.ts')
export interface Usuario {
  nombre: string;
  cuenta: string;
  rol: 'admin' | 'centinela';
}

export interface NoAutorizado {
  id: string;
  dni: string;
  nombre: string;
  motivo: string;
  fecha_reporte: string;
}

// --- TIPOS GLOBALES ---
export type Vista = 'dashboard' | 'registrar_tarjeta' | 'consultar_no_autorizado' | 'registrar_visita' | 'registrar_no_autorizado' | 'registrar_morador';


function App() {
  // --- 2. ELIMINAMOS EL ESTADO DEL USUARIO ---
  // const [usuario, setUsuario] = useState<Usuario | null>(null);

  // --- 3. OBTENEMOS TODO DEL CONTEXTO ---
  const { isAuthenticated, user, logout } = useAuth();

  const [vistaActual, setVistaActual] = useState<Vista>('dashboard');

  // handleLoginSuccess ya no es necesario aquí, LoginPage lo hará con el contexto

  // handleLogout ahora usa el contexto
  const handleLogout = () => {
    logout();
    // No necesitamos setUsuario(null), el contexto lo hace
  };

  const handleNavegar = (vista: Vista) => {
    setVistaActual(vista);
  };

  const handleVolverDashboard = () => {
    setVistaActual('dashboard');
  };


  // --- 4. LÓGICA DE RENDERIZADO MODIFICADA ---

  // Si NO estamos autenticados, siempre mostramos el Login
  if (!isAuthenticated) {
    // onLoginSuccess ya no es necesario, LoginPage usa el contexto
    return <LoginPage />;
  }

  // Si ESTAMOS autenticados (user existe), decidimos qué vista mostrar
  switch (vistaActual) {
    case 'dashboard':
      return (
        <DashboardPage
          usuario={user!} // user! (con !) le dice a TS que user no es null aquí
          onLogout={handleLogout}
          onNavegar={handleNavegar}
        />
      );
    case 'registrar_tarjeta':
      return (
        <RegistrarTarjetaPage
          onVolver={handleVolverDashboard}
        />
      );
    case 'consultar_no_autorizado':
      return (
        <ConsultarNoAutorizadoPage
          onVolver={handleVolverDashboard}
        />
      );
    case 'registrar_visita':
      return (
        <RegistrarVisitaPage
          onVolver={handleVolverDashboard}
        />
      );
    case 'registrar_no_autorizado':
      return (
        <RegistrarNoAutorizadoPage
          onVolver={handleVolverDashboard}
        />
      );
    case 'registrar_morador':
      return (
        <RegistrarMoradorPage
          onVolver={handleVolverDashboard}
        />
      );

    default:
      setVistaActual('dashboard');
      return null;
  }
}

export default App;