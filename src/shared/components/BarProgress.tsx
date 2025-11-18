import type { BarProgressProps } from "../../interface/registro.interface";


export const BarProgress = ({ step, progress }: BarProgressProps) => {
  let progressWidth: string;

  if (progress !== undefined && typeof progress === 'number' && progress >= 0 && progress <= 100) {
    progressWidth = `${progress}%`;
  }
  else if (step) {
    progressWidth = step === 'BUSCAR_DNI' ? '33%'
      : step === 'REGISTRAR_DATOS' ? '66%'
        : '100%';
  } else {
    progressWidth = '0%';
  }

  return (
    <div className="mb-12 h-1.5 w-full rounded-full bg-gray-200">
      <div
        className="h-1.5 rounded-full bg-[#4B6F44] transition-all duration-500"
        style={{ width: progressWidth }}
      ></div>
    </div>
  );
};