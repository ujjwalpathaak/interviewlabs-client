import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
const PeerContext = React.createContext(null);
export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  return (
    <PeerContext.Provider
      value={{
        me,
        setMe,
        stream,
        setStream,
        receivingCall,
        setReceivingCall,
        caller,
        setCaller,
        callerSignal,
        setCallerSignal,
        callAccepted,
        setCallAccepted,
        idToCall,
        setIdToCall,
        callEnded,
        setCallEnded,
        name,
        setName,
        myVideo,
        userVideo,
        connectionRef,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
