export interface MoradorData {
    id: string;
    nombre: string;
    dni: string;
    direccion: string;
    numeroTarjeta: string;
}

export interface Props {
    onVolver: () => void;
}
export interface BarProgressProps {
    step?: Step;
    progress?: number;
  }

export type Step = 'BUSCAR_DNI' | 'REGISTRAR_DATOS' | 'EXITO';