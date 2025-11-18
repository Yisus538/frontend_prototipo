export const Header = ({ onLogout }: { onLogout?: () => void }) => (
  <header className="flex w-full items-center justify-between bg-[#4B593C] px-8 py-4 text-white shadow-md">
    <div className="flex items-center space-x-4">
      <div className="flex flex-col space-y-1">
        <div className="h-1 w-12 rounded-full bg-white/80"></div>
        <div className="h-1 w-12 rounded-full bg-white/80"></div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-wider">BARRIO MILITAR</span>
        <span className="text-lg font-bold tracking-wider">GENERAL DEHEZA</span>
      </div>
    </div>
    <nav className="flex items-center space-x-8 text-sm font-medium">
      <button onClick={onLogout} className="hover:underline">Cerrar sesión</button>
    </nav>
  </header>
);