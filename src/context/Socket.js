import React, { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
// const SOCKET_URL = "http://localhost:9000"

const SocketProvider = ({ children }) => {

  const socket = useRef();
  useEffect(() => {
    socket.current = io(`${SOCKET_URL}`);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;