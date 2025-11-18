import { useState } from 'react';
import { Header } from '../shared/components/Header';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import type { Props, Step } from '../interface/registro.interface';
import { BarProgress } from '../shared/components/BarProgress';
import { API_ROUTES } from '../apiConfig';



export function RegistrarMoradorPage({ onVolver }: Props) {
  const { token } = useAuth();
  const [step, setStep] = useState<Step>('BUSCAR_DNI');

  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscarDni = async () => {
    if (!dni) return;
    setLoading(true);
    setError(null);

    try {
      await axios.get(`${API_ROUTES.moradores}/${dni}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setError('Este DNI YA se encuentra registrado como morador.');

    } catch (err: any) {
      if (err.response?.status === 404) {
        setStep('REGISTRAR_DATOS');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      } else {
        setError('Error al conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!nombre || !direccion || !numeroTarjeta) {
      setError('Todos los campos son requeridos.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_ROUTES.moradores}`, {
        dni,
        nombre,
        direccion,
        numeroTarjeta
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setStep('EXITO');

    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Error: Este DNI ya fue agregado por alguien más.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      } else {
        setError('No se pudo guardar. Intente de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReiniciar = () => {
    setDni('');
    setNombre('');
    setDireccion('');
    setNumeroTarjeta('');
    setError(null);
    setStep('BUSCAR_DNI');
  };

  const renderStep = () => {
    switch (step) {
      case 'BUSCAR_DNI':
        return (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-full max-w-md">
              <label htmlFor="dni_input" className="mb-2 block text-sm font-bold text-[#2F3E20]">Ingresar DNI del Nuevo Morador</label>
              <input
                id="dni_input"
                type="text"
                placeholder="DNI de la persona a registrar"
                className="w-full border-b-2 border-gray-300 py-2 text-lg outline-none focus:border-[#4B593C]"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscarDni()}
              />
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleBuscarDni}
                  disabled={loading}
                  className="rounded-md bg-[#8F9E78] px-12 py-2 text-white font-medium shadow-md transition hover:bg-[#7A8C60] disabled:opacity-50"
                >
                  {loading ? 'Verificando...' : 'Siguiente'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'REGISTRAR_DATOS':
        return (
          <div className="w-full max-w-lg mx-auto py-6 animate-fade-in">
            <div className="mb-4 rounded-md border border-green-300 bg-[#DFFFD6] p-4 text-center text-green-900">
              DNI disponible. Complete los datos para registrar al nuevo morador.
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="inline-block rounded-md bg-[#4B6F44] px-4 py-1 text-lg font-semibold text-white">
                Datos del Nuevo Morador
              </h3>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">DNI</label>
                  <p className="text-lg font-semibold text-gray-800">{dni}</p>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="nombre_input" className="mb-1 block text-sm font-medium text-gray-700">Nombre y Apellido</label>
                  <input
                    id="nombre_input"
                    type="text"
                    placeholder="Ej: Juan Perez"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="dir_input" className="mb-1 block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    id="dir_input"
                    type="text"
                    placeholder="Ej: Sector A, Casa 10"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="tarjeta_input" className="mb-1 block text-sm font-medium text-gray-700">N° Tarjeta Asignada</label>
                  <input
                    id="tarjeta_input"
                    type="text"
                    placeholder="Ej: TAR300"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg"
                    value={numeroTarjeta}
                    onChange={(e) => setNumeroTarjeta(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={handleGuardar}
                disabled={loading}
                className="rounded-md bg-[#8F9E78] px-10 py-2 text-white font-medium shadow transition hover:bg-[#7A8C60] disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Registrar Morador'}
              </button>
              <button
                onClick={handleReiniciar}
                disabled={loading}
                className="rounded-md bg-gray-300 px-10 py-2 text-gray-700 font-medium shadow transition hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        );

      case 'EXITO':
        return (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <div className="flex w-full max-w-md items-center justify-center rounded-xl bg-[#DFFFD6] p-12 text-center shadow-sm">
              <p className="text-2xl font-medium text-green-900">
                Morador registrado correctamente
              </p>
            </div>
            <button
              onClick={onVolver}
              className="mt-10 w-full max-w-xs rounded-md bg-[#8F9E78] py-2 text-white font-medium shadow-md hover:bg-[#7A8C60]"
            >
              Salir
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">

        {/* Título y Botón Volver */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={step === 'BUSCAR_DNI' ? onVolver : handleReiniciar}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6B9080] text-white transition hover:bg-[#4B593C]"
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-medium text-[#6B9080]">Registrar Nuevo Morador</h1>
        </div>

        <BarProgress step={step} />
        {error && (
          <div className="mb-6 rounded-md border border-red-300 bg-red-100 p-4 text-center text-red-800">
            {error}
          </div>
        )}
        {renderStep()}
      </main>
    </div>
  );
}