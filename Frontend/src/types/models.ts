export type Habitacion = {
    id: number; 
    hotel: string; 
    numero: number;
    consumo:number;
    nivel: Nivel; 
    images: string; 
    presencia_humana: boolean; 
    temperatura: number; 
    humedad: number; 
    fecha_actualizacion: string; 
};

export type Nivel ={
    id: number,
    nivel: number,
    consumo: number,
    fecha_actualizacion:string,
};
  