import { useState } from 'react';
import { Header } from '../shared/components/Header';
import { useAuth } from '../context/AuthContext';
import type { Props, Step } from '../interface/noAutorizado.interface';
import { BarProgress } from '../shared/components/BarProgress';
import { API_ROUTES } from '../apiConfig';


export function RegistrarVisitaPage({ onVolver }: Props) {
  const { token } = useAuth();
  const [step, setStep] = useState<Step>('BUSCAR_DNI');

  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleBuscarDni = async () => {
    if (!dni) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_ROUTES.noAutorizados}/${dni}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {

        setError('Esta persona se encuentra en la lista de no autorizados. No se puede registrar la visita.');
      } else if (response.status === 404) {
        setStep('REGISTRAR_DATOS');
      } else if (response.status === 401 || response.status === 403) {
        setError('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      } else {
        throw new Error('Error del servidor');
      }
    } catch (err) {
      setError('Error al conectar con el servidor. ¿Está encendido?');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarVisita = async () => {
    if (!nombre) {
      setError('El nombre y apellido son requeridos.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/api/visitas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dni, nombre }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError('Sesión expirada. Por favor, vuelve a iniciar sesión.');
        } else {
          throw new Error('Error al guardar la visita');
        }
      } else {
        setStep('EXITO');
      }
    } catch (err) {
      setError('No se pudo guardar la visita. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleReiniciar = () => {
    setDni('');
    setNombre('');
    setError(null);
    setStep('BUSCAR_DNI');
  };


  const renderStep = () => {
    switch (step) {
      case 'BUSCAR_DNI':
        return (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-full max-w-md">
              <label htmlFor="dni_input" className="mb-2 block text-sm font-bold text-[#2F3E20]">Ingresar</label>
              <input
                id="dni_input"
                type="text"
                placeholder="DNI"
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
                  {loading ? 'Buscando...' : 'Siguiente'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'REGISTRAR_DATOS':
        return (
          <div className="w-full max-w-lg mx-auto py-6 animate-fade-in">
            <div className="mb-4 rounded-md border border-green-300 bg-[#DFFFD6] p-4 text-center text-green-900">
              La persona no se encuentra en la lista de no autorizados.
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="inline-block rounded-md bg-[#4B6F44] px-4 py-1 text-lg font-semibold text-white">
                Nueva visita
              </h3>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">DNI</label>
                  <p className="text-lg font-semibold text-gray-800">{dni}</p>
                </div>
                <div>
                  <label htmlFor="nombre_input" className="mb-1 block text-sm font-medium text-gray-700">Nombre y Apellido</label>
                  <input
                    id="nombre_input"
                    type="text"
                    placeholder="Ej: Santiago Torres"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg outline-none focus:border-[#4B593C] focus:ring-1 focus:ring-[#4B593C]"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={handleGuardarVisita}
                disabled={loading}
                className="rounded-md bg-[#8F9E78] px-10 py-2 text-white font-medium shadow transition hover:bg-[#7A8C60] disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar visita'}
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
            <div className="flex w-full max-w-md items-center justify-center rounded-xl bg-[#DFFFD6] p-12 text-center shadow-sm">
              <p className="text-2xl font-medium text-green-900">
                La visita se ha registrado correctamente
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
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={step === 'BUSCAR_DNI' ? onVolver : handleReiniciar}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6B9080] text-white transition hover:bg-[#4B593C]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-2xl font-medium text-[#6B9080]">Registrar visita</h1>
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