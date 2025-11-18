import { useState } from 'react';
import { Header } from './shared/components/Header';
import type { DashboardPageProps } from './interface/dashborad.interface';

const MenuButton = ({ label, onClick }: { label: string; onClick: () => void; }) => (
  <button
    onClick={onClick}
    className="w-full transform rounded-lg bg-white py-5 text-left text-xl font-bold text-black shadow-sm transition-all hover:scale-[1.01] hover:shadow-md border border-transparent hover:border-gray-200 px-8 mb-4 last:mb-0"
  >
    {label}
  </button>
);

export const DashboardPage = ({ onLogout, usuario, onNavegar }: DashboardPageProps) => {
  const [paginaActual, setPaginaActual] = useState(1);

  const opcionesAdmin: Record<number, string[]> = {
    1: ["Registrar Tarjeta", "Consultar no Autorizado", "Registrar no Autorizado", "Registrar Visita", "Registrar Morador"],
    2: ["Registrar Personal Fijo", "Consultar Visita", "Registrar Patente", "Registrar Personal Temporal", "Registrar Reclamo baja Tarjeta"],
    3: ["Consultar Personal Temporal", "Consultar Personal Fijo"],
  };
  const opcionesCentinela: Record<number, string[]> = {
    1: ["Registrar Ingreso", "Consultar no Autorizado", "Registrar Salida", "Consultar Personal Temporal", "Consultar Personal Fijo"],
  };

  const menuItems = usuario.rol === 'admin' ? opcionesAdmin[paginaActual] : opcionesCentinela[paginaActual];
  const totalPaginas = usuario.rol === 'admin' ? 3 : 1;

  const irSiguientePagina = () => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));

  const irPaginaAnterior = () => setPaginaActual((prev) => Math.max(prev - 1, 1))

  const handleMenuClick = (opcion: string) => {
    if (opcion === "Registrar Tarjeta") {
      onNavegar('registrar_tarjeta');
    }
    else if (opcion === "Consultar no Autorizado") {
      onNavegar('consultar_no_autorizado');
    }
    else if (opcion === "Registrar Visita") {
      onNavegar('registrar_visita');
    } else if (opcion === "Registrar no Autorizado") {
      onNavegar('registrar_no_autorizado');
    } else if (opcion === "Registrar Morador") {
      onNavegar('registrar_morador');
    }
    else {
      console.log("Opción seleccionada:", opcion);
      alert(`Funcionalidad "${opcion}" no implementada aún.`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] font-sans">
      <Header onLogout={onLogout} />

      <main className="flex flex-1 items-start justify-center p-10">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
          {/* Columna Izquierda */}
          <div className="flex flex-col space-y-2 md:col-span-1 pt-10">
            <h1 className="text-6xl font-bold text-[#1C2E10]">Inicio</h1>
            <h2 className="text-3xl font-medium text-[#2F3E20] capitalize">
              {usuario.rol === 'admin' ? 'Administrador' : 'Centinela'}
            </h2>
            <p className="text-lg text-gray-600">
              Hola, <span className="font-semibold">{usuario.nombre}</span>
            </p>

            <div className="pt-8 flex flex-col gap-4">
              {paginaActual < totalPaginas && (
                <button
                  onClick={irSiguientePagina}
                  className="w-full rounded-lg bg-[#4B593C] px-8 py-4 text-xl font-medium text-white shadow-lg transition-colors hover:bg-[#3A452F]"
                >
                  Siguiente
                </button>
              )}
              {paginaActual > 1 && (
                <button
                  onClick={irPaginaAnterior}
                  className="w-full rounded-lg bg-[#4B593C] px-8 py-4 text-xl font-medium text-white shadow-lg transition-colors hover:bg-[#3A452F]"
                >
                  Atras
                </button>
              )}
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="md:col-span-2">
            <div
              key={paginaActual}
              className="rounded-2xl bg-gray-100/50 p-8 shadow-[0_0_15px_rgba(0,0,0,0.1)] 
                         animate-fade-in-right"
            >
              {menuItems && menuItems.map((item, index) => (
                <MenuButton
                  key={item + index}
                  label={item}
                  onClick={() => handleMenuClick(item)}
                />
              ))}
              {!menuItems || menuItems.length === 0 && (
                <p className="text-center text-gray-500 text-lg">No hay opciones disponibles en esta página.</p>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Paginación */}
      <footer className="mb-8 flex justify-center space-x-4">
        {Array.from({ length: totalPaginas }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setPaginaActual(index + 1)}
            className={`flex h-10 w-10 items-center justify-center rounded text-lg font-bold shadow transition-colors duration-200 
              ${paginaActual === index + 1 ? 'bg-[#4B593C] text-white' : 'border border-gray-400 bg-transparent text-gray-600 hover:bg-gray-200'}
            `}
          >
            {index + 1}
          </button>
        ))}
      </footer>
    </div>
  );
}