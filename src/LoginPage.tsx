import React, { useState, type ChangeEvent } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from './context/AuthContext';
import { Logo } from './shared/components/Logo';
import { API_ROUTES } from './apiConfig';



type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
};

const InputConIcono = ({ icon, ...props }: InputProps) => (
  <div className="relative w-full">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </div>
    <input
      {...props}
      className="w-full border-b-2 border-gray-300 py-2 pl-10 pr-3 text-gray-800 outline-none transition-colors focus:border-gray-800"
    />
  </div>
);


export function LoginPage() {
  const { login } = useAuth();
  const [cuenta, setCuenta] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    try {
      const response = await axios.post(API_ROUTES.login, {
        cuenta,
        contrasena
      });

      Swal.fire({
        title: '¡Acceso Autorizado!',
        text: `Bienvenido, ${response.data.usuario.nombre}`,
        icon: 'success',
        confirmButtonText: 'Ingresar',
        confirmButtonColor: '#4B593C',
        background: '#fafff9',
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        login(response.data.token, response.data.usuario);
      });

    } catch (err: any) {
      console.error('Error login:', err);

      let mensajeError = 'Error de conexión con el servidor.';
      if (err.response && err.response.status === 401) {
        mensajeError = 'Credenciales incorrectas. Verifique cuenta y contraseña.';
      }

      Swal.fire({
        title: 'Acceso Denegado',
        text: mensajeError,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#d33',
      });

    } finally {
      setCargando(false);
    }
  };
  const handleCuenta = (e: ChangeEvent<HTMLInputElement>) => setCuenta(e.target.value) ;
  const handleContrasena = (e: ChangeEvent<HTMLInputElement>) => setContrasena(e.target.value)
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#4B593C] p-4 font-sans">
      <Logo />
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Ingresar Cuenta
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5 space-y-6">
            <InputConIcono
              icon={<User size={20} />}
              type="text"
              placeholder="Cuenta"
              value={cuenta}
              onChange={handleCuenta}
              required
            />
            <div className="relative">
              <InputConIcono
                icon={<Lock size={20} />}
                type={mostrarContrasena ? 'text' : 'password'}
                placeholder="Contraseña"
                value={contrasena}
                onChange={handleContrasena}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className={`mt-8 w-full rounded-lg py-3 font-bold text-gray-800 transition-transform 
              ${cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9A9E7C] hover:scale-105 hover:bg-opacity-90'}
            `}
          >
            {cargando ? 'Verificando...' : 'Iniciar Sesión'}
          </button>

          <button
            type="button"
            className="mt-4 w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
          >
            Modificar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}