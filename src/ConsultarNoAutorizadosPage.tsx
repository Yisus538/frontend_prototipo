import { useState } from 'react';
import { Header } from './shared/components/Header';
import { type NoAutorizado, type Props } from './interface/app.interface'; 
import { useAuth } from './context/AuthContext'; 
import { API_ROUTES } from './apiConfig';

export function ConsultarNoAutorizadoPage({ onVolver }: Props) {
  const { token } = useAuth(); 
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [haBuscado, setHaBuscado] = useState(false);
  const [resultado, setResultado] = useState<NoAutorizado | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const handleBuscar = async () => {
    if (!dniBusqueda) return;
    setLoading(true);
    setErrorApi(null);

    try {
    
      const response = await fetch(`${API_ROUTES.noAutorizados}/${dniBusqueda}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
      });

      if (response.ok) {
        const data: NoAutorizado = await response.json();
        setResultado(data);
      } else if (response.status === 404) {
        setResultado(null);
      } else if (response.status === 401 || response.status === 403) {
        setErrorApi("Sesión expirada. Por favor, inicie sesión de nuevo.");
      } else {
        throw new Error('Error del servidor al buscar');
      }

      setHaBuscado(true);

    } catch (error) {
      console.error(error);
      setErrorApi("Error al conectar con el servidor. ¿Está encendido?");
    } finally {
      setLoading(false);
    }
  };

  const handleReiniciar = () => {
    setHaBuscado(false);
    setDniBusqueda('');
    setResultado(null);
    setErrorApi(null);
  };

  return (
    // --- TU CÓDIGO JSX (SIN CAMBIOS) ---
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8">

        {/* Título y Botón Volver */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={onVolver}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6B9080] text-white transition hover:bg-[#4B593C]"
            aria-label="Volver al inicio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-2xl font-medium text-[#6B9080]">Consultar no Autorizados</h1>
        </div>


        <div className="mb-12 h-1.Gira (Rotación): Usa las flechas izquierda/derecha.5 w-full rounded-full bg-gray-200">
          <div className={`h-1.5 rounded-full bg-[#4B6F44] transition-all duration-500 ${haBuscado ? 'w-full' : 'w-1/2'}`}></div>
        </div>


        {errorApi && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-4 text-center text-red-800">
            {errorApi}
          </div>
        )}
        {!haBuscado ? (
          <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
            <div className="w-full max-w-md">
              <label htmlFor="dni_input" className="mb-2 block text-sm font-bold text-[#2F3E20]">Ingresar</label>
              <input
                id="dni_input"
                type="text"
                placeholder="DNI"
                className="w-full border-b-2 border-gray-300 py-2 text-lg outline-none focus:border-[#4B593C] placeholder-gray-400"
                value={dniBusqueda}
                onChange={(e) => setDniBusqueda(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              />

              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleBuscar}
                  disabled={!dniBusqueda || loading}
                  className="rounded-md bg-[#8F9E78] px-12 py-2 text-white font-medium shadow-md transition hover:bg-[#7A8C60] disabled:opacity-50"
                >
                  {loading ? 'Buscando...' : 'Siguiente'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 pt-4 animate-fade-in">

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase text-[#2F3E20]">Persona</h3>
                {resultado ? (

                  <div className="mt-4 space-y-2 text-lg">
                    <p><span className="font-semibold">DNI:</span> {resultado.dni}</p>
                    <p><span className="font-semibold">Nombre:</span> {resultado.nombre}</p>
                    <p className="text-red-600"><span className="font-semibold text-black">Motivo:</span> {resultado.motivo}</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2 text-lg">
                    <p><span className="font-semibold">DNI:</span> {dniBusqueda}</p>
                    <p className="text-gray-500 italic">Sin datos registrados</p>
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: Caja de Estado */}
            <div className="flex flex-col items-center justify-center space-y-8">

              {resultado ? (
                <div className="flex w-full max-w-sm items-center justify-center rounded-xl bg-red-200 p-8 text-center shadow-sm">
                  <p className="text-xl font-medium text-red-900">
                    ¡ALERTA! <br /> La persona SE ENCUENTRA en la lista de no autorizados.
                  </p>
                </div>
              ) : (
                <div className="flex w-full max-w-sm items-center justify-center rounded-xl bg-[#DFFFD6] p-8 text-center shadow-sm">
                  <p className="text-xl font-medium text-green-900">
                    La persona no se encuentra en la lista de no autorizados
                  </p>
                </div>
              )}

              <button
                onClick={handleReiniciar}
                className="w-full max-w-xs rounded-md bg-[#8F9E78] py-2 text-white font-medium shadow-md hover:bg-[#7A8C60]"
              >
                Salir
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}