export interface MoradorData {
    id: string;
    nombre: string;
    dni: string;
    direccion: string;
    numeroTarjeta: string;
}

export interface RegistrarTarjetaPageProps {
    onVolver: () => void;
}

export type Step = 'BUSCAR_DNI' | 'REGISTRAR_DATOS' | 'EXITO';