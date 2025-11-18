import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, User } from 'lucide-react';
import { Header } from '../shared/components/Header';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import type { MoradorData, Props } from '../interface/registro.interface';
import { API_ROUTES } from '../apiConfig';



const ProgressBar = ({ step }: { step: number }) => {
  const progressWidth = `${(step / 4) * 100}%`;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
      <div
        className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: progressWidth }}
      ></div>
    </div>
  );
};
export function RegistrarTarjetaPage({ onVolver }: Props) {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [patente, setPatente] = useState('');
  const [idMorador, setIdMorador] = useState('');
  const [datosMorador, setDatosMorador] = useState<MoradorData | null>(null);
  const [cargando, setCargando] = useState(false);


  const handlePaso1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patente) return;
    setStep(2);
  };
  const handlePaso2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idMorador) return;
    setCargando(true);


    try {
      const response = await axios.get(`${API_ROUTES.moradores}/${idMorador}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setDatosMorador(response.data);
      setStep(3);

    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        Swal.fire('Error', 'Sesión expirada. Por favor, inicie sesión de nuevo.', 'error');

      } else if (err.response?.status === 404) {
        Swal.fire('Error', 'No se encontró el morador con ese ID.', 'error');
      } else {
        Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
      }
    } finally {
      setCargando(false);
    }
  };
  const handlePaso3Submit = async () => {
    setCargando(true);


    try {
      await axios.post(`${API_ROUTES.tarjetas}`, {
        idMorador: datosMorador?.id,
        patente: patente,
        numeroTarjeta: datosMorador?.numeroTarjeta
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStep(4);

    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        Swal.fire('Error', 'Sesión expirada. Por favor, inicie sesión de nuevo.', 'error');
      } else {
        Swal.fire('Error', 'No se pudo generar la tarjeta.', 'error');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleSalir = () => {
    setStep(1);
    setPatente('');
    setIdMorador('');
    setDatosMorador(null);
    onVolver();
  };
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] font-sans">
      <Header />

      <main className="flex-1 p-10">
        <div className="mx-auto max-w-2xl">

          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={step > 1 ? () => setStep(step - 1) : onVolver}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200 text-green-700 transition-colors hover:bg-green-300"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-700">Registrar tarjeta</h1>
          </div>

          <ProgressBar step={step} />

          {step === 1 && (
            <div className="rounded-xl bg-white p-8 shadow-lg animate-fade-in">
              <form onSubmit={handlePaso1Submit}>
                <label htmlFor="patente" className="block text-lg font-semibold text-gray-700 mb-2">Ingresar Patente</label>
                <input
                  type="text"
                  id="patente"
                  value={patente}
                  onChange={(e) => setPatente(e.target.value.toUpperCase())}
                  placeholder="Ej: ABC123"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4B593C] focus:ring focus:ring-[#4B593C] focus:ring-opacity-50 p-3 text-lg"
                />
                <button
                  type="submit"
                  disabled={!patente}
                  className="mt-6 w-full rounded-lg bg-[#858a6a] py-3 text-lg font-bold text-white shadow transition-colors hover:bg-[#6c7052] disabled:bg-gray-400"
                >
                  Siguiente
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-xl bg-white p-8 shadow-lg animate-fade-in">
              <form onSubmit={handlePaso2Submit}>
                <label htmlFor="idMorador" className="block text-lg font-semibold text-gray-700 mb-2">Ingresar IdMorador</label>
                <input
                  type="text"
                  id="idMorador"
                  value={idMorador}
                  onChange={(e) => setIdMorador(e.target.value)}
                  placeholder="Ej: 45120365"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4B593C] focus:ring focus:ring-[#4B593C] focus:ring-opacity-50 p-3 text-lg"
                />
                <button
                  type="submit"
                  disabled={!idMorador || cargando}
                  className="mt-6 w-full rounded-lg bg-[#858a6a] py-3 text-lg font-bold text-white shadow transition-colors hover:bg-[#6c7052] disabled:bg-gray-400"
                >
                  {cargando ? 'Buscando...' : 'Siguiente'}
                </button>
              </form>
            </div>
          )}

          {step === 3 && datosMorador && (
            <div className="rounded-xl bg-white p-8 shadow-lg animate-fade-in">
              <h2 className="mb-6 text-xl font-semibold text-gray-800 border-b pb-3">Datos tarjeta</h2>
              <div className="space-y-3 text-lg text-gray-700">
                <p><strong>Numero:</strong> {datosMorador.numeroTarjeta}</p>
                <p><strong>Nombre y Apellido:</strong> {datosMorador.nombre}</p>
                <p><strong>DNI:</strong> {datosMorador.dni}</p>
                <p><strong>Dirección:</strong> {datosMorador.direccion}</p>
                <p><strong>Patente:</strong> {patente}</p>
              </div>
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={handlePaso3Submit}
                  disabled={cargando}
                  className="flex-1 rounded-lg bg-[#858a6a] py-3 text-lg font-bold text-white shadow transition-colors hover:bg-[#6c7052] disabled:bg-gray-400"
                >
                  {cargando ? 'Generando...' : 'Generar tarjeta'}
                </button>
                <button
                  onClick={handleSalir}
                  className="flex-1 rounded-lg bg-gray-300 py-3 text-lg font-bold text-gray-700 shadow transition-colors hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {step === 4 && datosMorador && (
            <div className="rounded-xl bg-white p-8 shadow-lg animate-fade-in text-center">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h2 className="text-3xl font-bold text-green-700 mb-6">
                Tarjeta generada correctamente
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
                <div className="bg-[#4B593C] text-white p-6 rounded-xl shadow-lg">
                  <span className="block text-right font-mono text-lg">{datosMorador.numeroTarjeta}</span>
                  <div className="mt-16">
                    <span className="block text-xs">Patente</span>
                    <span className="block font-mono text-2xl">{patente}</span>
                  </div>
                </div>
                <div className="bg-gray-100 border border-gray-300 p-6 rounded-xl shadow-lg flex items-center space-x-4">
                  <User size={64} className="text-gray-400" />
                  <div>
                    <span className="text-xl font-bold text-gray-800">{datosMorador.nombre}</span>
                    <span className="block text-gray-600">{datosMorador.direccion}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSalir}
                className="mt-10 w-full max-w-xs mx-auto rounded-lg bg-[#858a6a] py-3 text-lg font-bold text-white shadow transition-colors hover:bg-[#6c7052]"
              >
                Salir
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}