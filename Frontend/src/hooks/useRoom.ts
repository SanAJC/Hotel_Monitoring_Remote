import { useState, useEffect, useRef } from "react";
import { Dispositivo, RegistroConsumo } from "@/types/models"; 

const useRoom = () => {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [registrosConsumo, setRegistrosConsumo] = useState<RegistroConsumo[]>([]);
  
  const dispositivosSocketRef = useRef<WebSocket | null>(null);
  const registrosSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("No se encontró el token de acceso.");
      return;
    }

    // Función para conectar a dispositivos
    const connectDispositivos = () => {
      const socket = new WebSocket(
        `ws://localhost:8000/ws/dispositivos/?token=${accessToken}`
      );

      socket.onopen = () => console.log("WebSocket dispositivos conectado");
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (!data || !data.forEach) {
          console.error("El payload recibido no es un array:", data);
          return;
  }
        setDispositivos(prev => {
          const deviceMap = new Map(prev.map(d => [d.id, d]));
          data.forEach((d: Dispositivo) => deviceMap.set(d.id, d));
          return Array.from(deviceMap.values());
        });
      };
      socket.onclose = () => {
        console.log("Conexión dispositivos cerrada. Reconectando...");
        setTimeout(connectDispositivos, 3000);
      };
      
      dispositivosSocketRef.current = socket;
    };
    // Función para conectar a registros_consumo
    const connectRegistros = () => {
      const socket = new WebSocket(
        `ws://localhost:8000/ws/registros_consumo/?token=${accessToken}`
      );

      socket.onopen = () => console.log("WebSocket registros conectado");
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setRegistrosConsumo(data); // Ajusta según la estructura de tus datos
      };
      socket.onclose = () => {
        console.log("Conexión registros cerrada. Reconectando...");
        setTimeout(connectRegistros, 3000);
      };
      
      registrosSocketRef.current = socket;
    };

    
    connectDispositivos();
    connectRegistros();

    return () => {
      dispositivosSocketRef.current?.close();
      registrosSocketRef.current?.close();
    };
  }, []);
  const sendCommand = (dispositivoId: number, estado: 'ENCENDER' | 'APAGAR') => {
    if (dispositivosSocketRef.current?.readyState === WebSocket.OPEN) {
      const command = {
        type: 'send_update',
        dispositivo_id: dispositivoId,
        action: estado
      };
      dispositivosSocketRef.current.send(JSON.stringify(command));
      console.log("Mensaje enviado con exito")
    } else {
      console.error("WebSocket no está conectado");
    }
  };

  return { dispositivos, registrosConsumo, sendCommand };
};

export default useRoom;