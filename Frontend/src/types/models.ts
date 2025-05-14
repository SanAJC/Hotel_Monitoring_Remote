
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
    tipo: 'AIRE' | 'VENTILADOR' | 'TELEVISOR' | 'FOCO_HABITACION' | 'FOCO_BAÑO';
    consumo_actual: number;
    consumo_acumulado: number;
    estado_remoto: 'APAGAR' | 'ENCENDER';
    on_image: string;
    off_image: string;
    fecha_actualizacion: string;
};


export type RegistroConsumo = {
    id: number;
    dispositivo: Dispositivo;
    habitacion: Habitacion;
    consumo: number;
    fecha: string;
};

export type Alerta = {
    id: number;
    habitacion: Habitacion;  // Relación con Habitacion
    tipo: 'CONSUMO_ALTO' | 'FALLA_SENSOR' | 'APAGADO_MANUAL';
    mensaje: string;
    fecha_creacion: string;
};

export type RegistrosWeekly = {
    day: string;
    habitaciones: Array<{
        numero: number;
        dispositivos: {
            AIRE: { max: number; avg: number; total: number; count: number };
            VENTILADOR: { max: number; avg: number; total: number; count: number };
            TELEVISOR: { max: number; avg: number; total: number; count: number };
            FOCO_HABITACION: { max: number; avg: number; total: number; count: number };
            FOCO_BAÑO: { max: number; avg: number; total: number; count: number };
        };
        consumo_total_habitacion: number;
    }>;
};

export type RegistrosMonthy = {
    month: string;
    habitaciones: Array<{
        numero: number;
        dispositivos: {
            AIRE: { max: number; avg: number; total: number; count: number };
            VENTILADOR: { max: number; avg: number; total: number; count: number };
            TELEVISOR: { max: number; avg: number; total: number; count: number };
            FOCO_HABITACION: { max: number; avg: number; total: number; count: number };
            FOCO_BAÑO: { max: number; avg: number; total: number; count: number };
        };
        consumo_total_mes: number;  
    }>;
};

export type RegistrosLevel = {
    month: string;
    niveles: {
        [key: string]: {
            max: number;
            avg: number;
            total: number;
            count: number;
        };
    };
    consumo_total_mes: number;
}