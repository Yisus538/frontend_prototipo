type Step = 'BUSCAR_DNI' | 'REGISTRAR_DATOS' | 'EXITO';

interface BarProgressProps {
  step: Step;
}

export const BarProgress = ({ step }: BarProgressProps) => {
  
  const progressWidth = step === 'BUSCAR_DNI' ? '33%' 
                      : step === 'REGISTRAR_DATOS' ? '66%' 
                      : '100%';

  return (
    <div className="mb-12 h-1.5 w-full rounded-full bg-gray-200">
      <div
        className="h-1.5 rounded-full bg-[#4B6F44] transition-all duration-500"
        style={{ width: progressWidth }}
      ></div>
    </div>
  );
};