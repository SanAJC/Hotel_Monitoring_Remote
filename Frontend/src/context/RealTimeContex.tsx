import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Habitacion, Dispositivo, RegistroConsumo, Nivel } from '@/types/models';

const WS_BASE_URL = 'ws://localhost:8000/ws';

interface WebSocketContextType {
  // WebSocket references
  roomsSocket: WebSocket | null;
  dispositivosSocket: WebSocket | null;
  registrosSocket: WebSocket | null;
  nivelesSocket: WebSocket | null;
  
  // Data states
  rooms: Habitacion[];
  dispositivos: Dispositivo[];
  registrosConsumo: RegistroConsumo[];
  niveles: Nivel[];
  
  // Actions
  sendCommand: (dispositivoId: number, estado: 'ENCENDER' | 'APAGAR') => void;
  
}

const WebSocketContext = createContext<WebSocketContextType>({
  roomsSocket: null,
  dispositivosSocket: null,
  registrosSocket: null,
  nivelesSocket: null,
  rooms: [],
  dispositivos: [],
  registrosConsumo: [],
  niveles: [],
  sendCommand: () => {},
});


export const useWebSockets = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // WebSocket refs
  const roomsSocketRef = useRef<WebSocket | null>(null);
  const dispositivosSocketRef = useRef<WebSocket | null>(null);
  const registrosSocketRef = useRef<WebSocket | null>(null);
  const nivelesSocketRef = useRef<WebSocket | null>(null);
  
  // Data states
  const [rooms, setRooms] = useState<Habitacion[]>([]);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [registrosConsumo, setRegistrosConsumo] = useState<RegistroConsumo[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  

  // Usamos una referencia para controlar si ya intentamos conectar
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    // Evitamos múltiples intentos de conexión
    if (hasConnectedRef.current) {
      console.log("Ya se intentó conectar anteriormente, evitando reconexión innecesaria");
      return;
    }

    // Marcamos que ya intentamos conectar
    hasConnectedRef.current = true;

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("No se encontró el token de acceso.");
      return;
    }
    
    console.log("Iniciando conexiones WebSocket con token:", accessToken);

    // Connect to rooms WebSocket
    const connectRoomsWebSocket = () => {
      // Si ya hay una conexión activa, no creamos otra
      if (roomsSocketRef.current && roomsSocketRef.current.readyState === WebSocket.OPEN) {
        console.log("WebSocket habitaciones ya está conectado");
        return;
      }
      
      // Cerramos cualquier conexión existente antes de crear una nueva
      if (roomsSocketRef.current) {
        roomsSocketRef.current.close();
      }

      try {
        console.log("Creando nueva conexión WebSocket para habitaciones");
        const newSocket = new WebSocket(
          `${WS_BASE_URL}/habitaciones/?token=${accessToken}`
        );

      newSocket.onopen = () => {
        console.log("WebSocket habitaciones conectado");
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Datos de habitaciones recibidos:", data);
      
        setRooms((prevRooms) => {
          const roomsMap = new Map(prevRooms.map((room) => [room.id, room]));
          
          if (Array.isArray(data)) {
            data.forEach((habitacion: Habitacion) => {
              roomsMap.set(habitacion.id, habitacion);
            });
          } else if (data && typeof data === 'object' && 'id' in data) {
            roomsMap.set(data.id, data as Habitacion);
          } else {
            console.error("El dato recibido no es un array:", data);
          }
          
          return Array.from(roomsMap.values())
            .sort((a, b) => a.numero - b.numero);
        });
      };

      newSocket.onclose = (event) => {
        console.log(`WebSocket habitaciones desconectado (código: ${event.code}). ${event.wasClean ? 'Cierre limpio' : 'Cierre inesperado'}`);
            
        // Solo reconectamos si el cierre no fue intencional
        if (!event.wasClean) {
          console.log("Reintentando conexión en 3 segundos...");
          setTimeout(connectRoomsWebSocket, 3000);
        }
      };

      newSocket.onerror = (error) => {
        console.error("Error en el WebSocket de habitaciones:", error);
        
      };

      roomsSocketRef.current = newSocket;
      } catch (error) {
        console.error("Error al crear WebSocket de habitaciones:", error);
        
      }
    };

    // Connect to dispositivos WebSocket
    const connectDispositivosWebSocket = () => {
      // Si ya hay una conexión activa, no creamos otra
      if (dispositivosSocketRef.current && dispositivosSocketRef.current.readyState === WebSocket.OPEN) {
        console.log("WebSocket dispositivos ya está conectado");
        return;
      }
      
      // Cerramos cualquier conexión existente antes de crear una nueva
      if (dispositivosSocketRef.current) {
        dispositivosSocketRef.current.close();
      }

      try {
        console.log("Creando nueva conexión WebSocket para dispositivos");
        const newSocket = new WebSocket(
          `${WS_BASE_URL}/dispositivos/?token=${accessToken}`
        );

      newSocket.onopen = () => {
        console.log("WebSocket dispositivos conectado");
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        setDispositivos(prev => {
          const deviceMap = new Map(prev.map(d => [d.id, d]));
          if (Array.isArray(data)) {
            data.forEach((d: Dispositivo) => deviceMap.set(d.id, d));
          } else if (data && typeof data === 'object' && 'id' in data) {
            deviceMap.set(data.id, data as Dispositivo);
          } else {
            console.error("El dato recibido no es un array:", data); 
          }
          return Array.from(deviceMap.values());
        });
      };

      newSocket.onclose = (event) => {
        console.log(`WebSocket dispositivos desconectado (código: ${event.code}). ${event.wasClean ? 'Cierre limpio' : 'Cierre inesperado'}`);
        
        // Solo reconectamos si el cierre no fue intencional
        if (!event.wasClean) {
          console.log("Reintentando conexión en 3 segundos...");
          setTimeout(connectDispositivosWebSocket, 3000);
        }
      };
      
      dispositivosSocketRef.current = newSocket;
      } catch (error) {
        console.error("Error al crear WebSocket de dispositivos:", error);
        
      }
    };

    // Connect to registros WebSocket
    const connectRegistrosWebSocket = () => {
      // Si ya hay una conexión activa, no creamos otra
      if (registrosSocketRef.current && registrosSocketRef.current.readyState === WebSocket.OPEN) {
        console.log("WebSocket registros ya está conectado");
        return;
      }
      
      // Cerramos cualquier conexión existente antes de crear una nueva
      if (registrosSocketRef.current) {
        registrosSocketRef.current.close();
      }

      try {
        console.log("Creando nueva conexión WebSocket para registros");
        const newSocket = new WebSocket(
          `${WS_BASE_URL}/registros_consumo/?token=${accessToken}`
        );

      newSocket.onopen = () => {
        console.log("WebSocket registros conectado");
        
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setRegistrosConsumo(data);
      };

      newSocket.onclose = (event) => {
        console.log(`WebSocket registros desconectado (código: ${event.code}). ${event.wasClean ? 'Cierre limpio' : 'Cierre inesperado'}`);
        
        
        // Solo reconectamos si el cierre no fue intencional
        if (!event.wasClean) {
          console.log("Reintentando conexión en 3 segundos...");
          setTimeout(connectRegistrosWebSocket, 3000);
        }
      };
      
      registrosSocketRef.current = newSocket;
      } catch (error) {
        console.error("Error al crear WebSocket de registros:", error);
        
      }
    };

    // Connect to niveles WebSocket
    const connectNivelesWebSocket = () => {
      // Si ya hay una conexión activa, no creamos otra
      if (nivelesSocketRef.current && nivelesSocketRef.current.readyState === WebSocket.OPEN) {
        console.log("WebSocket niveles ya está conectado");
        return;
      }
      
      // Cerramos cualquier conexión existente antes de crear una nueva
      if (nivelesSocketRef.current) {
        nivelesSocketRef.current.close();
      }

      try {
        console.log("Creando nueva conexión WebSocket para niveles");
        const newSocket = new WebSocket(
          `${WS_BASE_URL}/niveles/?token=${accessToken}`
        );

      newSocket.onopen = () => {
        console.log("WebSocket niveles conectado");
        
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        setNiveles((prevNiveles) => {
          const nivelesMap = new Map(
            prevNiveles.map((nivel) => [nivel.id, nivel])
          );
          if (Array.isArray(data)) {
            data.forEach((nivel: Nivel) => {
              nivelesMap.set(nivel.id, nivel);
            });
          } else if (data && typeof data === 'object' && 'id' in data) {
            nivelesMap.set(data.id, data as Nivel);
          } else {
            console.error("El dato recibido no es un array:", data); 
          }
          
          return Array.from(nivelesMap.values());
        });
      };

      newSocket.onclose = (event) => {
        console.log(`WebSocket niveles desconectado (código: ${event.code}). ${event.wasClean ? 'Cierre limpio' : 'Cierre inesperado'}`);
        
        
        // Solo reconectamos si el cierre no fue intencional
        if (!event.wasClean) {
          console.log("Reintentando conexión en 3 segundos...");
          setTimeout(connectNivelesWebSocket, 3000);
        }
      };

      newSocket.onerror = (error) =>
        console.error("Error en el WebSocket de niveles:", error);

      nivelesSocketRef.current = newSocket;
      } catch (error) {
        console.error("Error al crear WebSocket de niveles:", error);
        
      }
    };

    // Initialize all WebSocket connections
    connectRoomsWebSocket();
    connectDispositivosWebSocket();
    connectRegistrosWebSocket();
    connectNivelesWebSocket();

    // Cleanup function to close all WebSockets when the provider unmounts
    return () => {
      console.log("Desmontando WebSocketProvider - Cerrando todas las conexiones WebSocket");
      // Cerramos las conexiones de forma limpia (wasClean = true)
      if (roomsSocketRef.current) roomsSocketRef.current.close(1000, "Cierre normal");
      if (dispositivosSocketRef.current) dispositivosSocketRef.current.close(1000, "Cierre normal");
      if (registrosSocketRef.current) registrosSocketRef.current.close(1000, "Cierre normal");
      if (nivelesSocketRef.current) nivelesSocketRef.current.close(1000, "Cierre normal");
      
      // Reseteamos la bandera de conexión para permitir reconexiones si el componente se vuelve a montar
      hasConnectedRef.current = false;
    };
  }, []);
  
  // Function to send commands to dispositivos
  const sendCommand = (dispositivoId: number, estado: 'ENCENDER' | 'APAGAR') => {
    if (dispositivosSocketRef.current?.readyState === WebSocket.OPEN) {
      const command = {
        type: 'send_update',
        dispositivo_id: dispositivoId,
        action: estado
      };
      dispositivosSocketRef.current.send(JSON.stringify(command));
      console.log("Mensaje enviado con éxito");
    } else {
      console.error("WebSocket no está conectado");
    }
  };

  // Context value
  const contextValue: WebSocketContextType = {
    roomsSocket: roomsSocketRef.current,
    dispositivosSocket: dispositivosSocketRef.current,
    registrosSocket: registrosSocketRef.current,
    nivelesSocket: nivelesSocketRef.current,
    rooms,
    dispositivos,
    registrosConsumo,
    niveles,
    sendCommand,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
