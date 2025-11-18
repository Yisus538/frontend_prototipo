import { useState } from 'react';
import { LoginPage } from './LoginPage'; // Asumo que tienes este componente
import { DashboardPage } from './DashboardPage';
import { RegistrarTarjetaPage } from './RegistrarTarjetaPage';
import { ConsultarNoAutorizadoPage } from './ConsultarNoAutorizadosPage'; // <-- 1. Importamos la nueva pantalla
import { RegistrarVisitaPage } from './RegistrarVisitaPage';
import { RegistrarNoAutorizadoPage } from './RegistrarNoAutorizadoPage';

// --- INTERFACES GLOBALES ---

// Interfaz de Usuario para login
export interface Usuario {
  nombre: string;
  cuenta: string;
  rol: 'admin' | 'centinela';
}

// Interfaz para la nueva pantalla (basado en tu JSON)
export interface NoAutorizado {
  id: string;
  dni: string;
  nombre: string;
  motivo: string;
  fecha_reporte: string;
}

// --- TIPOS GLOBALES ---

// Definimos los tipos de vistas que la app puede mostrar
// <-- 2. Añadimos la nueva vista
export type Vista = 'dashboard' | 'registrar_tarjeta' | 'consultar_no_autorizado' | 'registrar_visita' | 'registrar_no_autorizado';


function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [vistaActual, setVistaActual] = useState<Vista>('dashboard');

  const handleLoginSuccess = (datosUsuario: Usuario) => {
    setUsuario(datosUsuario);
    setVistaActual('dashboard');
  };

  const handleLogout = () => {
    setUsuario(null);
  };

  // Función que pasamos al Dashboard para cambiar de vista
  const handleNavegar = (vista: Vista) => {
    setVistaActual(vista);
  };

  // Función para que las sub-páginas puedan volver al dashboard
  const handleVolverDashboard = () => {
    setVistaActual('dashboard');
  };


  // --- Lógica de Renderizado ---

  // Si NO hay usuario, siempre mostramos el Login
  if (!usuario) {
    // Asegúrate de tener el componente LoginPage en tu proyecto
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Si HAY usuario, decidimos qué vista mostrar
  switch (vistaActual) {
    case 'dashboard':
      return (
        <DashboardPage
          usuario={usuario}
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

    // <-- 3. AÑADIMOS EL CASO PARA LA NUEVA PANTALLA
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


    default:
      // Caso por defecto, volvemos al dashboard
      setVistaActual('dashboard');
      return null;
  }
}

export default App;