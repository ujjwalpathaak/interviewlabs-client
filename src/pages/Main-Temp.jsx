import React, { useEffect, useCallback, useState, useContext } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import CodeEditArea from "../components/Main/CodeEditArea";
import { usePeer } from "../context/Peer";
import { SocketContext } from "../context/Socket";
import { selectUser } from "../provider/userSlice";

const Main = ({ code }) => {
  const { socket } = useContext(SocketContext);

  const [mystream, setMyStream] = useState(null);
  const user = useSelector(selectUser);
  const [otherTempStream, setOtherTempStream] = useState(null);
  const {
    peer,
    sendStream,
    otherStream,
    createOffer,
    createAnswer,
    setRemoteAnswer,
  } = usePeer();

  const handleRoomJoined = useCallback(
    async (data) => {
      const { name } = data;
      const offer = await createOffer();
      console.log(`calling -> ${name}`);
      socket.current.emit("call-user", { name, offer });
      setOtherTempStream(name);
    },
    [createOffer, socket]
  );

  const handleRoomCreated = useCallback((data) => {
    const { roomId, name } = data;
    console.log(`Room ${roomId} created by user -> ${name}`);
  }, []);

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log(`incomming call from -> ${from}`, offer);
      const ans = await createAnswer(offer);
      socket.current.emit("call-accepted", { name: from, ans });
      setOtherTempStream(from);
    },
    [createAnswer, socket, setOtherTempStream]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("got accepted", ans);
      await setRemoteAnswer(ans);
    },
    [setRemoteAnswer]
  );

  const handleNegoIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log(`nego incomming call from -> ${from}`, offer);
      const ans = await createAnswer(offer);
      socket.current.emit("nego-call-accepted", { name: from, ans });
      setOtherTempStream(from);
    },
    [createAnswer, socket, setOtherTempStream]
  );

  const handleNegoCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("got accepted", ans);
      await setRemoteAnswer(ans);
    },
    [setRemoteAnswer]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    sendStream(stream);
  }, [sendStream]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  useEffect(() => {
    socket.current.on("newRoom-created", handleRoomCreated);
    socket.current.on("newUser-joined", handleRoomJoined);
    socket.current.on("incomming-call", handleIncomingCall);
    socket.current.on("calling-accepted", handleCallAccepted);
    socket.current.on("nego-incomming-call", handleNegoIncomingCall);
    socket.current.on("nego-calling-accepted", handleNegoCallAccepted);
    return () => {
      socket.current.off("room-created", handleRoomCreated);
      socket.current.off("newUser-joined", handleRoomJoined);
      socket.current.off("incomming-call", handleIncomingCall);
      socket.current.off("calling-accepted", handleCallAccepted);
      socket.current.off("nego-incomming-call", handleNegoIncomingCall);
      socket.current.off("nego-calling-accepted", handleNegoCallAccepted);
    };
  }, [
    handleNegoCallAccepted,
    handleNegoIncomingCall,
    handleRoomCreated,
    handleRoomJoined,
    handleIncomingCall,
    handleCallAccepted,
    socket,
  ]);

  const handleNegosiation = useCallback(async () => {
    console.log("negotiation needed");
    const tempOffer = await peer.createOffer();
    socket.current.emit("nego-call-user", {
      name: otherTempStream,
      offer: tempOffer,
    });
  }, [socket, peer, otherTempStream]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegosiation);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegosiation);
    };
  }, [handleNegosiation, socket, peer]);

  return (
    <div className="bg-[#EEEEEE] w-[100vw] h-[100vh] flex flex-col sm:justify-around items-center sm:p-2 sm:flex-row">
      <div className="w-full h-[30vh] flex-col sm:rounded-lg sm:h-[95vh] sm:mr-2 sm:w-[24vw] sm:min-w-[350px]">
        <div className="bg-[#393E46] w-[100%] h-full flex flex-row justify-start sm:h-[92%] sm:flex-col sm:justify-between sm:p-4 sm:min-h-[550px] rounded-t-lg">
          <div className="h-[50%]">
            <div className=" bg-white min-h-[250px] h-full w-[50%] sm:rounded-lg sm:w-[100%] sm:h-[85%]">
              <ReactPlayer
                url={mystream}
                width="100%"
                height="100%"
                playing
                muted
              />
            </div>
            <p className="font-medium text-slate-100 m-2">{user.name}</p>
          </div>
          <div className="h-[50%]">
            <div className="min-h-[250px] bg-white h-full w-[50%] sm:rounded-lg sm:w-[100%] sm:h-[85%]">
              <ReactPlayer
                url={otherStream}
                width="100%"
                height="100%"
                playing
              />
            </div>
            <p className="font-medium text-slate-100 m-2">
              {otherTempStream}
            </p>
          </div>
        </div>
        <div className="bg-[#00ADB5] h-[5%] w-[100%] flex items-center p-2 rounded-b-lg">
          <h1 className="mr-2 font-medium">Room Code: </h1>
          <span className="mr-2">{code}</span>
        </div>

      </div>
      <div className="bg-[#EEEEEE] flex flex-col justify-between mt-6 sm:mt-0 w-[100%] h-[60vh] sm:h-[95vh] sm:w-[74vw]">
        <CodeEditArea />
      </div>
    </div>
  );
};

export default Main;
