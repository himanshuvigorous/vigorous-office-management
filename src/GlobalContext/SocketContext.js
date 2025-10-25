import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BACKEND_DOMAIN_NAME;

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketsRef = useRef({});
  const [activeSocketName, setActiveSocketName] = useState(null);
  useEffect(() => {
    socketsRef.current = {
      socketConnection: io(`${SOCKET_URL}`, {
        transports: ['websocket'],
        autoConnect: false,
      }),
    
    };
    return () => {
      Object.values(socketsRef.current).forEach((socket) => socket.disconnect());
    };
  }, []);

  const setActiveSocket = (name) => {
    setActiveSocketName((prevName) => {
      if (prevName && socketsRef.current[prevName]) {
        socketsRef.current[prevName].disconnect();
      }
      if (socketsRef.current[name]) {
        if (document.visibilityState === 'visible') {
          socketsRef.current[name].connect();
        }
      }
      return name;
    });
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      const active = socketsRef.current[activeSocketName];
      if (!active) return;

      if (document.visibilityState === 'visible') {
        if (!active.connected) active.connect();
      } else {
        if (active.connected) active.disconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeSocketName]);

  const value = {
    setActiveSocket,
    socket: socketsRef.current[activeSocketName] || null,
    activeSocketName,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
