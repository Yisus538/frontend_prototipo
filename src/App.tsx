import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { RegistrarTarjetaPage } from './layout/RegistrarTarjetaPage';
import { ConsultarNoAutorizadoPage } from './ConsultarNoAutorizadosPage';
import { RegistrarVisitaPage } from './layout/RegistrarVisitaPage';
import { RegistrarNoAutorizadoPage } from './layout/RegistrarNoAutorizadoPage';
import { useAuth } from './context/AuthContext';
import { RegistrarMoradorPage } from './layout/RegistrarMoradorPage';
import type { Vista } from './interface/app.interface';


export const App = () => {

  const { isAuthenticated, user, logout } = useAuth();

  const [vistaActual, setVistaActual] = useState<Vista>('dashboard');

  const handleLogout = () => {
    logout();
  };
  const handleNavegar = (vista: Vista) => {
    setVistaActual(vista);
  };
  const handleVolverDashboard = () => {
    setVistaActual('dashboard');
  };

  if (!isAuthenticated) return <LoginPage />;

  switch (vistaActual) {
    case 'dashboard':
      return (
        <DashboardPage
          usuario={user!}
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