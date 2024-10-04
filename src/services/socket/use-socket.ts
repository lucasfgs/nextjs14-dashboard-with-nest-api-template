import { useEffect, useRef, useState } from "react";

import { useWebSocket } from "@/components/providers/websocket";

type UseSocketReturn<T> = {
  sendEvent: <T>(eventName: string, data: T) => void;
  listenToEvent: <T>(eventName: string, callback: (data: T) => void) => void;
  removeListener: (eventName: string) => void;
  error: Error | null;
};

const useSocket = <T = any>(): UseSocketReturn<T> => {
  const socket = useWebSocket();
  const [error, setError] = useState<Error | null>(null);
  const listeners = useRef<{ [key: string]: (data: any) => void }>({});

  useEffect(() => {
    if (!socket) return;

    const currentListeners = listeners.current;

    // Handle connection error
    socket.on("connect_error", (err: Error) => {
      console.error("Connection error:", err);
      setError(err);
    });

    socket.on("message", (message: T) => {
      console.log("Message received:", message);
    });

    // listen to any other events here
    socket.on("event", (data: any) => {
      console.log("Event received:", data);
    });

    return () => {
      // Cleanup all the listeners when the component unmounts
      Object.keys(currentListeners).forEach((eventName) => {
        socket.off(eventName, currentListeners[eventName]);
      });
    };
  }, [socket]);

  const sendEvent = (eventName: string, data: any) => {
    if (socket) {
      socket.emit(eventName, data);
    }
  };

  const listenToEvent = (eventName: string, callback: (data: any) => void) => {
    if (socket) {
      listeners.current[eventName] = callback;
      socket.on(eventName, callback);
    }
  };

  const removeListener = (eventName: string) => {
    if (socket && listeners.current[eventName]) {
      socket.off(eventName, listeners.current[eventName]);
      delete listeners.current[eventName];
    }
  };

  return { sendEvent, listenToEvent, removeListener, error };
};

export default useSocket;
