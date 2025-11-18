export interface Usuario {
  nombre: string;
  cuenta: string;
  rol: 'admin' | 'centinela';
}

export interface NoAutorizado {
  id: string;
  dni: string;
  nombre: string;
  motivo: string;
  fecha_reporte: string;
}

export type Vista = 'dashboard' |
  'registrar_tarjeta' |
  'consultar_no_autorizado' |
  'registrar_visita' |
  'registrar_no_autorizado' |
  'registrar_morador';

export interface Props {
  onVolver: () => void;
}
