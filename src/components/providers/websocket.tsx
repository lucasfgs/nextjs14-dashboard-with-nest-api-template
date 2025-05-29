import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

export const WebSocketContext = createContext<Socket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useLayoutEffect(() => {
    let socketInstance: Socket;
    async function getSocket() {
      // Create a socket connection
      socketInstance = io(process.env.WEBSOCKET_URL || "", {
        autoConnect: true,
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      setSocket(socketInstance);
    }

    getSocket();

    return () => {
      socketInstance?.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
