import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

// --- Interfaces ---
interface ResultadoConsulta {
  status: 'NO_AUTORIZADO' | 'AUTORIZADO' | 'NO_REGISTRADO';
  dni: string;
  nombre: string;
  motivo?: string;
  direccion?: string;
}

interface ConsultarNoAutorizadosPageProps {
  onVolver: () => void;
}

// --- Componentes de UI (copiados de tu diseño) ---
const ProgressBar = ({ step }: { step: number }) => {
  const progressPercentage = (step / 2) * 100; // Solo 2 pasos
  const width = Math.min(100, Math.max(0, progressPercentage));
  return (
    <div className="w-full bg-gray-300 rounded-full h-3 my-8">
      <div
        className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

const InputLinea = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full border-b-2 border-gray-300 bg-transparent py-3 text-lg text-gray-800 outline-none transition-colors focus:border-[#4B593C]"
  />
);

const BotonPrincipal = ({ children, onClick, disabled }: { children: React.ReactNode, onClick?: () => void, disabled?: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={onClick ? "button" : "submit"}
      className="w-full rounded-lg bg-[#858a6a] py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-[#6c7052] hover:shadow-xl disabled:bg-gray-400 disabled:shadow-md"
    >
      {children}
    </button>
);


// --- Componente Principal de la Página ---
export function ConsultarNoAutorizadosPage({ onVolver }: ConsultarNoAutorizadosPageProps) {
  const [step, setStep] = useState(1);
  const [dni, setDni] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni) return;
    setCargando(true);

    try {
      // Usamos la nueva ruta inteligente
      const response = await axios.get(`http://localhost:4000/api/consultar-dni/${dni}`);
      setResultado(response.data);
      setStep(2); // Avanzamos al paso de resultados
    } catch (err: any) {
      console.error(err);
      Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleSalir = () => {
    setStep(1);
    setDni('');
    setResultado(null);
    onVolver();
  };

  return (
    <main className="flex-1 p-6 md:p-10">
      <div className="mx-auto max-w-lg">
        
        {/* Título y Botón Volver */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={step > 1 ? () => setStep(1) : onVolver}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200 text-green-700 transition-colors hover:bg-green-300"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-700">Consultar no Autorizados</h1>
        </div>

        <ProgressBar step={step} />

        {/* --- PASO 1: INGRESAR DNI --- */}
        {step === 1 && (
          <div className="rounded-xl bg-white p-8 shadow-xl animate-fade-in">
            <form onSubmit={handleSubmit}>
              <label htmlFor="dni" className="block text-lg font-semibold text-gray-700 mb-2">Ingresar</label>
              <InputLinea
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="DNI"
                type="number"
              />
              <div className="mt-8">
                <BotonPrincipal disabled={!dni || cargando}>
                  {cargando ? 'Consultando...' : 'Siguiente'}
                </BotonPrincipal>
              </div>
            </form>
          </div>
        )}

        {/* --- PASO 2: MOSTRAR RESULTADO --- */}
        {step === 2 && resultado && (
          <div className="rounded-xl bg-white p-8 shadow-xl animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">PERSONA</h2>
            
            {/* Datos de la persona */}
            <div className="mb-6 space-y-2">
              <p><strong>DNI:</strong> {resultado.dni}</p>
              <p><strong>Nombre y Apellido:</strong> {resultado.nombre}</p>
            </div>

            {/* Mensaje de Estado (VERDE o ROJO) */}
            {resultado.status === 'NO_AUTORIZADO' && (
              <div className="rounded-lg bg-red-100 p-6 text-center text-2xl font-bold text-red-800 shadow-md">
                <XCircle className="mx-auto mb-2 h-10 w-10" />
                ¡ALERTA! La persona SE ENCUENTRA en la lista de no autorizados.
                <p className="text-lg font-normal mt-2">Motivo: {resultado.motivo}</p>
              </div>
            )}
            
            {(resultado.status === 'AUTORIZADO' || resultado.status === 'NO_REGISTRADO') && (
              <div className="rounded-lg bg-green-100 p-6 text-center text-2xl font-bold text-green-800 shadow-md">
                <CheckCircle className="mx-auto mb-2 h-10 w-10" />
                La persona NO SE ENCUENTRA en la lista de no autorizados.
                {resultado.status === 'AUTORIZADO' && (
                   <p className="text-lg font-normal mt-2">Es un morador registrado.</p>
                )}
              </div>
            )}

            <div className="mt-10 max-w-xs mx-auto">
              <BotonPrincipal onClick={handleSalir}>
                Salir
              </BotonPrincipal>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}