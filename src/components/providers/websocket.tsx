import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

import { getAccessTokenFromCookies } from "@/utils/getAccessTokenFromCookies";

export const WebSocketContext = createContext<Socket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useLayoutEffect(() => {
    let socketInstance: Socket;
    async function getSocket() {
      const token = await getAccessTokenFromCookies();

      // Create a socket connection
      socketInstance = io("http://localhost:4000", {
        autoConnect: true,
        transports: ["websocket", "polling"],
        auth: {
          token,
        },
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
