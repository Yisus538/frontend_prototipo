import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { RegistrarTarjetaPage } from './RegistrarTarjetaPage'; // <-- 1. Importamos la nueva vista

// Definimos la interfaz de Usuario aquí para usarla en toda la app
export interface Usuario {
  nombre: string;
  cuenta: string;
  rol: 'admin' | 'centinela';
}

// Definimos los tipos de vistas que la app puede mostrar
export type Vista = 'dashboard' | 'registrar_tarjeta'; // Puedes añadir más aquí

function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // --- 2. Nuevo estado para manejar la navegación ---
  const [vistaActual, setVistaActual] = useState<Vista>('dashboard');

  const handleLoginSuccess = (datosUsuario: Usuario) => {
    setUsuario(datosUsuario);
    setVistaActual('dashboard'); // Al iniciar sesión, siempre vamos al dashboard
  };

  const handleLogout = () => {
    setUsuario(null);
    // No es necesario resetear la vista, se irá al login automáticamente
  };

  // --- 3. Función que pasamos al Dashboard para cambiar de vista ---
  const handleNavegar = (vista: Vista) => {
    setVistaActual(vista);
  };

  // --- 4. Función para que la sub-página pueda volver al dashboard ---
  const handleVolverDashboard = () => {
    setVistaActual('dashboard');
  };


  // --- Lógica de Renderizado ---

  // Si NO hay usuario, siempre mostramos el Login
  if (!usuario) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Si HAY usuario, decidimos qué vista mostrar

  // Usando un switch (muy útil si crecen las vistas)
  switch (vistaActual) {
    case 'dashboard':
      return (
        <DashboardPage
          usuario={usuario}
          onLogout={handleLogout}
          onNavegar={handleNavegar} // <-- 5. ¡Prop conectada!
        />
      );
    case 'registrar_tarjeta':
      return (
        <RegistrarTarjetaPage
          onVolver={handleVolverDashboard} // <-- 6. Prop para regresar
        />
      );
    default:
      // Caso por defecto, volvemos al dashboard
      setVistaActual('dashboard');
      return null;
  }
}

export default App;