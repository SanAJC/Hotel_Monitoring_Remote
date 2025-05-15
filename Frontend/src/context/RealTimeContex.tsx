import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Habitacion, Dispositivo, Nivel , Hotel , Alerta, RegistrosWeekly,RegistrosMonthy , RegistrosLevel} from '@/types/models';
import { toast } from 'react-toastify';

const WS_BASE_URL = `${import.meta.env.VITE_API_URL.replace('http', 'ws').replace('https', 'wss')}/ws`;

interface WebSocketContextType {
  // WebSocket references
  roomsSocket: WebSocket | null;
  dispositivosSocket: WebSocket | null;
  hotelSocket: WebSocket | null;
  nivelesSocket: WebSocket | null;
  alertasSocket: WebSocket | null;
  registrosConsumoSocket: WebSocket | null;
  
  // Data states
  rooms: Habitacion[];
  dispositivos: Dispositivo[];
  hotel: Hotel[];
  niveles: Nivel[];
  alertas: Alerta[];
  registrosConsumoWeekly: RegistrosWeekly[];
  registrosConsumoMonthly: RegistrosMonthy[];
  registrosConsumoNivel: RegistrosLevel[];
  
  // Actions
  sendCommand: (dispositivoId: number, estado: 'ENCENDER' | 'APAGAR') => void;
  
}

const WebSocketContext = createContext<WebSocketContextType>({
  roomsSocket: null,
  dispositivosSocket: null,
  hotelSocket: null,
  nivelesSocket: null,
  alertasSocket: null,
  registrosConsumoSocket: null,
  rooms: [],
  dispositivos: [],
  hotel: [],
  niveles: [],
  alertas: [],
  registrosConsumoWeekly: [],
  registrosConsumoMonthly: [],
  registrosConsumoNivel: [],
  sendCommand: () => {},
});


export const useWebSockets = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // WebSocket refs
  const roomsSocketRef = useRef<WebSocket | null>(null);
  const dispositivosSocketRef = useRef<WebSocket | null>(null);
  const hotelSocketRef = useRef<WebSocket | null>(null);
  const nivelesSocketRef = useRef<WebSocket | null>(null);
  const alertasSocketRef = useRef<WebSocket | null>(null);
  const registrosConsumoSocketRef = useRef<WebSocket | null>(null);
  
  // Data states
  const [rooms, setRooms] = useState<Habitacion[]>([]);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [hotel, setHotel] = useState<Hotel[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [registrosConsumoWeekly, setRegistrosConsumoWeekly] = useState<RegistrosWeekly[]>([]);
  const [registrosConsumoMonthly, setRegistrosConsumoMonthly] = useState<RegistrosMonthy[]>([]);
  const [registrosConsumoNivel, setRegistrosConsumoNivel] = useState<RegistrosLevel[]>([]);

  // Usamos una referencia para controlar si ya intentamos conectar
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        console.log("Esperando a que el token de acceso esté disponible...");
        return;
      }

      console.log("Token de acceso encontrado, iniciando conexiones WebSocket");
      clearInterval(interval);

      // Evitamos múltiples intentos de conexión
      if (hasConnectedRef.current) {
        console.log("Ya se intentó conectar anteriormente, evitando reconexión innecesaria");
        return;
      }

      // Marcamos que ya intentamos conectar
      hasConnectedRef.current = true;

      // Inicializamos las conexiones WebSocket
      connectRoomsWebSocket();
      connectDispositivosWebSocket();
      connectHotelWebSocket();
      connectNivelesWebSocket();
      connectAlertasWebSocket();
      connectRegistrosConsumoWebSocket();
    }, 500); // Verificamos cada 500ms

    return () => clearInterval(interval);
  }, []);

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
      const accessToken = sessionStorage.getItem("accessToken");
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

  const connectDispositivosWebSocket = () => {

    if (dispositivosSocketRef.current && dispositivosSocketRef.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket dispositivos ya está conectado");
      return;
    }
    
    if (dispositivosSocketRef.current) {
      dispositivosSocketRef.current.close();
    }

    try {
      console.log("Creando nueva conexión WebSocket para dispositivos");
      const accessToken = sessionStorage.getItem("accessToken");
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

  const connectHotelWebSocket = () => {

    if (hotelSocketRef.current && hotelSocketRef.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket hotel ya está conectado");
      return;
    }
    
    if (hotelSocketRef.current) {
      hotelSocketRef.current.close();
    }

    try {
      console.log("Creando nueva conexión WebSocket para hotel");
      const accessToken = sessionStorage.getItem("accessToken");
      const newSocket = new WebSocket(
        `${WS_BASE_URL}/hoteles/?token=${accessToken}`
      );

    newSocket.onopen = () => {
      console.log("WebSocket hotel conectado");
      
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Datos de hotel recibidos:", data);
      setHotel(prev => {
        const deviceMap = new Map(prev.map(d => [d.id, d]));
        if (Array.isArray(data)) {
          data.forEach((d: Hotel) => deviceMap.set(d.id, d));
        } else if (data && typeof data === 'object' && 'id' in data) {
          deviceMap.set(data.id, data as Hotel);
        } else {
          console.error("El dato recibido no es un array:", data); 
        }
        return Array.from(deviceMap.values());
      });
    };

    newSocket.onclose = (event) => {
      console.log(`WebSocket hotel desconectado (código: ${event.code}). ${event.wasClean ? 'Cierre limpio' : 'Cierre inesperado'}`);
      
      if (!event.wasClean) {
        console.log("Reintentando conexión en 3 segundos...");
        setTimeout(connectHotelWebSocket, 3000);
      }
    };
    
    hotelSocketRef.current = newSocket;
    } catch (error) {
      console.error("Error al crear WebSocket de hotel:", error);
      
    }
  };

  const connectNivelesWebSocket = () => {
    
    if (nivelesSocketRef.current && nivelesSocketRef.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket niveles ya está conectado");
      return;
    }
    
    if (nivelesSocketRef.current) {
      nivelesSocketRef.current.close();
    }

    try {
      console.log("Creando nueva conexión WebSocket para niveles");
      const accessToken = sessionStorage.getItem("accessToken");
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

  // Función para solicitar permisos de notificaciones
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Permisos de notificación concedidos');
        return true;
      }
      console.log('Permisos de notificación denegados');
      return false;
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
      return false;
    }
  };

  // Función para mostrar notificación
  const showNotification = (title: string, body: string) => {
    try {
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body: body,
          icon: '/hotel.png',
          requireInteraction: true
        });

        // Manejar clic en la notificación
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    } catch (error) {
      console.error('Error al mostrar notificación:', error);
    }
  };

  // Solicitar permisos al montar el componente
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const connectAlertasWebSocket = () => {
    // Si ya hay una conexión activa, no creamos otra
    if (alertasSocketRef.current && alertasSocketRef.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket alertas ya está conectado");
      return;
    }
    
    // Cerramos cualquier conexión existente antes de crear una nueva
    if (alertasSocketRef.current) {
      alertasSocketRef.current.close();
    }

    try {
      console.log("Creando nueva conexión WebSocket para alertas");
      const accessToken = sessionStorage.getItem("accessToken");
      const newSocket = new WebSocket(
        `${WS_BASE_URL}/alertas/?token=${accessToken}`
      );

    newSocket.onopen = () => {
      console.log("WebSocket alertas conectado");
      
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Datos de alertas recibidos:", data);

      setAlertas((prevAlertas) => {
        const alertasMap = new Map(
          prevAlertas.map((alerta) => [alerta.id, alerta])
        );
        if (Array.isArray(data)) {
          data.forEach((alerta: Alerta) => {
            alertasMap.set(alerta.id, alerta);
          });
        } else if (data && typeof data === 'object' && 'id' in data) {
          alertasMap.set(data.id, data as Alerta);
          // Mostrar notificación para nuevas alertas si la pestaña no está activa
          if (document.hidden) {
            showNotification(
              'Nueva Alerta',
              `${data.tipo} en habitación ${data.habitacion.numero}`
            );
          }
        } else {
          console.error("El dato recibido no es un array:", data); 
        }

        return Array.from(alertasMap.values());
      });

      // Mostrar toast para todas las alertas
      toast.warning(`Alerta: ${data.tipo ? data.tipo : "No hay alertas"}`);
    };

    newSocket.onclose = (event) => {
      console.log(`WebSocket alertas desconectado (código: ${event.code}). ${event.wasClean ? 'Cierre limpio' : 'Cierre inesperado'}`);
      
      
      // Solo reconectamos si el cierre no fue intencional
      if (!event.wasClean) {
        console.log("Reintentando conexión en 3 segundos...");
        setTimeout(connectAlertasWebSocket, 3000);
      }
    };

    newSocket.onerror = (error) =>
      console.error("Error en el WebSocket de alertas:", error);

    alertasSocketRef.current = newSocket;
    } catch (error) {
      console.error("Error al crear WebSocket de alertas:", error);
      
    }
  };

  const connectRegistrosConsumoWebSocket = () => {

    if (registrosConsumoSocketRef.current && registrosConsumoSocketRef.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket registros de consumo ya está conectado");
      return;
    }
    
    if (registrosConsumoSocketRef.current) {
      registrosConsumoSocketRef.current.close();
    }

    try {
      console.log("Creando nueva conexión WebSocket para registros de consumo");
      const accessToken = sessionStorage.getItem("accessToken");
      const newSocket = new WebSocket(
        `${WS_BASE_URL}/registros_consumo/?token=${accessToken}`
      );

    newSocket.onopen = () => {
      console.log("WebSocket registros de consumo conectado");
      
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'weekly_update':
          setRegistrosConsumoWeekly(data.data);
          console.log("Registros de consumo semanales actualizados:", data.data);
          break;
        case 'monthly_update':
          setRegistrosConsumoMonthly(data.data);
          console.log("Registros de consumo mensuales actualizados:", data.data);
          break;
        case 'monthly_nivel_update':
          setRegistrosConsumoNivel(data.data);
          console.log("Registros de consumo nivel actualizados:", data.data);
          break;
        default:
          console.error("Tipo de dato desconocido:", data.type);
      }

    };

    newSocket.onclose = (event) => {
      console.log(`WebSocket niveles desconectado (código: ${event.code}). ${event.wasClean ? 'Cierre limpio' : 'Cierre inesperado'}`);
      
      if (!event.wasClean) {
        console.log("Reintentando conexión en 3 segundos...");
        setTimeout(connectRegistrosConsumoWebSocket, 3000);
      }
    };

    newSocket.onerror = (error) =>
      console.error("Error en el WebSocket de registros de consumo:", error);

    nivelesSocketRef.current = newSocket;
    } catch (error) {
      console.error("Error al crear WebSocket de registros de consumo:", error);
      
    }
  };
  

  // Cleanup function to close all WebSockets when the provider unmounts
  useEffect(() => {
    return () => {
      console.log("Desmontando WebSocketProvider - Cerrando todas las conexiones WebSocket");
      // Cerramos las conexiones de forma limpia (wasClean = true)
      if (roomsSocketRef.current) roomsSocketRef.current.close(1000, "Cierre normal");
      if (dispositivosSocketRef.current) dispositivosSocketRef.current.close(1000, "Cierre normal");
      if (hotelSocketRef.current) hotelSocketRef.current.close(1000, "Cierre normal");
      if (nivelesSocketRef.current) nivelesSocketRef.current.close(1000, "Cierre normal");
      if (alertasSocketRef.current) alertasSocketRef.current.close(1000, "Cierre normal");
      if (registrosConsumoSocketRef.current) registrosConsumoSocketRef.current.close(1000, "Cierre normal");
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
    hotelSocket: hotelSocketRef.current,
    nivelesSocket: nivelesSocketRef.current,
    alertasSocket: alertasSocketRef.current,
    registrosConsumoSocket: registrosConsumoSocketRef.current,
    rooms,
    dispositivos,
    hotel,
    niveles,
    alertas,
    registrosConsumoWeekly,
    registrosConsumoMonthly,
    registrosConsumoNivel,
    sendCommand,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
