
export type User = {
    id: number;
    username: string;
    email: string;
    rol: string;
};


export type Hotel = {
    id: number;
    user: User; 
    consumo_total: number;
    presupuesto: number;
    consumo_desperdicio_total: number;
    eficiencia_energetica: number;
    fecha_actualizacion: string;
};


export type Nivel = {
    id: number;
    nivel: number;
    consumo: number;
    fecha_actualizacion: string;
};


export type Habitacion = {
    id: number;
    hotel: Hotel;  
    numero: number;
    consumo: number;
    nivel: Nivel; 
    images: string;
    presencia_humana: boolean;
    temperatura: number;
    humedad: number;
    consumo_desperdicio: number;
    fecha_actualizacion: string;
};


export type Dispositivo = {
    id: number;
    habitacion: Habitacion;  
    tipo: 'AIRE' | 'VENTILADOR' | 'TELEVISOR' | 'FOCO_HABITACION' | 'FOCO_BANO';
    consumo_actual: number;
    estado_remoto: 'APAGAR' | 'ENCENDER';
    on_image: string;
    off_image: string;
    fecha_actualizacion: string;
};


export type RegistroConsumo = {
    id: number;
    dispositivo: Dispositivo;  // Relación con Dispositivo
    consumo: number;
    fecha: string;
};

export type Alerta = {
    id: number;
    habitacion: Habitacion;  // Relación con Habitacion
    tipo: 'CONSUMO_ALTO' | 'FALLA_SENSOR' | 'APAGADO_MANUAL';
    fecha_creacion: string;
};