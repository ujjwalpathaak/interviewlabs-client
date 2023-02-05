import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const SOCKET_URL = process.env.REACT_APP_DEVELOPMENT_SOCKET_URL;

const SocketProvider = ({ children }) => {
  const socket = useRef();

  const [socketId, setSocketId] = useState()

  useEffect(() => {
    socket.current = io(`${SOCKET_URL}`);
    socket.current.on("me", (id) => {
      console.log(id)
      setSocketId(id);
    });
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketId
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;