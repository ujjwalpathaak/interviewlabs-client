import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext(null);
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL
export const useSocket = () => {
  return useContext(SocketContext);
};
export const SocketProvider = (props) => {
  const socket = useMemo(() =>
    io(SOCKET_URL)
  );

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};