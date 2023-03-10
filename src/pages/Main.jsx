import React, { useEffect, useCallback, useState, useContext } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";

import CodeEditArea from "../components/Main/CodeEditArea";
import { usePeer } from "../context/Peer";
import { SocketContext } from "../context/Socket";
import { selectUser } from "../provider/userSlice";
import Peer from "simple-peer"

const Main = ({ code }) => {
  const { socket } = useContext(SocketContext);
  // const [mystream, setMyStream] = useState(null);
  const user = useSelector(selectUser);
  // const [otherTempStream, setOtherTempStream] = useState(null);
  const {
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
  } = usePeer();

  // const handleRoomJoined = useCallback(
  //   async (data) => {
  //     const { name } = data;
  //     const offer = await createOffer();
  //     console.log(`calling -> ${name}`);
  //     socket.current.emit("call-user", { name, offer });
  //     setOtherTempStream(name);
  //   },
  //   [createOffer, socket]
  // );

  // const handleRoomCreated = (data) => {
  //   const { roomId, name } = data;
  //   console.log(`Room ${roomId} created by user -> ${name}`);
  // };

  // const handleIncomingCall = useCallback(
  //   async (data) => {
  //     const { from, offer } = data;
  //     console.log(`incomming call from -> ${from}`, offer);
  //     const ans = await createAnswer(offer);
  //     socket.current.emit("call-accepted", { name: from, ans });
  //     setOtherTempStream(from);
  //   },
  //   [createAnswer, socket, setOtherTempStream]
  // );

  // const handleCallAccepted = async (data) => {
  //   const { ans } = data;
  //   console.log("got accepted", ans);
  //   await setRemoteAnswer(ans);
  // };

  // const handleNegoIncomingCall = async (data) => {
  //   const { from, offer } = data;
  //   console.log(`nego incomming call from -> ${from}`, offer);
  //   const ans = await createAnswer(offer);
  //   socket.current.emit("nego-call-accepted", { name: from, ans });
  //   setOtherTempStream(from);
  // };

  // const handleNegoCallAccepted = async (data) => {
  //   const { ans } = data;
  //   console.log("got accepted", ans);
  //   await setRemoteAnswer(ans);
  // };

  // const getUserMediaStream = useCallback(async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //     video: true,
  //   });
  //   setMyStream(stream);
  //   sendStream(stream);
  // }, [sendStream]);

  // useEffect(() => {
  //   getUserMediaStream();
  // }, [getUserMediaStream]);

  // useEffect(() => {
  //   socket.current.on("newRoom-created", handleRoomCreated);
  //   socket.current.on("newUser-joined", handleRoomJoined);
  //   socket.current.on("incomming-call", handleIncomingCall);
  //   socket.current.on("calling-accepted", handleCallAccepted);
  //   socket.current.on("nego-incomming-call", handleNegoIncomingCall);
  //   socket.current.on("nego-calling-accepted", handleNegoCallAccepted);
  //   return () => {
  //     socket.current.off("room-created", handleRoomCreated);
  //     socket.current.off("newUser-joined", handleRoomJoined);
  //     socket.current.off("incomming-call", handleIncomingCall);
  //     socket.current.off("calling-accepted", handleCallAccepted);
  //     socket.current.off("nego-incomming-call", handleNegoIncomingCall);
  //     socket.current.off("nego-calling-accepted", handleNegoCallAccepted);
  //   };
  // }, [
  //   handleNegoCallAccepted,
  //   handleNegoIncomingCall,
  //   handleRoomCreated,
  //   handleRoomJoined,
  //   handleIncomingCall,
  //   handleCallAccepted,
  //   socket,
  // ]);

  // const handleNegosiation = async () => {
  //   console.log("negotiation needed");
  //   const tempOffer = await peer.createOffer();
  //   socket.current.emit("nego-call-user", {
  //     name: otherTempStream,
  //     offer: tempOffer,
  //   });
  // };

  // useEffect(() => {
  //   peer.addEventListener("negotiationneeded", handleNegosiation);
  //   return () => {
  //     peer.removeEventListener("negotiationneeded", handleNegosiation);
  //   };
  // }, [handleNegosiation, socket]);

  //  --------------------------------------------------------------------------------------------------------------

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((stream) => {
  //       setStream(stream);
  //       myVideo.current.srcObject = stream;
  //     });

  //   socket.on("me", (id) => {
  //     setMe(id);
  //   });

  //   socket.on("callUser", (data) => {
  //     setReceivingCall(true);
  //     setCaller(data.from);
  //     setName(data.name);
  //     setCallerSignal(data.signal);
  //   });
  // }, []);

  // //
  // const callUser = (id) => {
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream: stream,
  //   });

  //   peer.on("signal", (data) => {
  //     socket.emit("callUser", {
  //       userToCall: id,
  //       signalData: data,
  //       from: me,
  //       name: name,
  //     });
  //   });
    
  //   peer.on("stream", (stream) => {
  //     userVideo.current.srcObject = stream;
  //   });
    
  //   socket.on("callAccepted", (signal) => {
  //     setCallAccepted(true);
  //     peer.signal(signal);
  //   });

  //   connectionRef.current = peer;
  // };

  // const answerCall = () => {
  //   setCallAccepted(true);
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream: stream,
  //   });
  //   peer.on("signal", (data) => {
  //     socket.emit("answerCall", { signal: data, to: caller });
  //   });
  //   peer.on("stream", (stream) => {
  //     userVideo.current.srcObject = stream;
  //   });

  //   peer.signal(callerSignal);
  //   connectionRef.current = peer;
  // };

  // const leaveCall = () => {
  //   setCallEnded(true);
  //   connectionRef.current.destroy();
  // };

  return (
    <div className="bg-[#EEEEEE] w-[100vw] h-[100vh] flex flex-col sm:justify-around items-center sm:p-2 sm:flex-row">
      {/* <JoinRoomPage /> */}
      <div className="w-full h-[30vh] flex-col sm:rounded-lg sm:h-[95vh] sm:mr-2 sm:w-[24vw] sm:min-w-[350px]">
        <div className="bg-[#393E46] w-[100%] h-full flex flex-row justify-start sm:h-[90%] sm:flex-col sm:p-4 sm:min-h-[550px] rounded-t-lg">
          <div className="min-h-[250px] bg-[#EEEEEE] h-full w-[50%] border-solid border-2 border-gray-400 sm:rounded-lg sm:w-[100%] sm:h-[45%] sm:mb-4">
            {/* <ReactPlayer
              url={mystream}
              width="100%"
              height="100%"
              playing
              muted
            /> */}
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "100%" }}
              />
            )}
          </div>
          <div className="min-h-[250px] bg-[#EEEEEE] h-full w-[50%] border-solid border-2 border-gray-400 sm:rounded-lg sm:w-[100%] sm:h-[45%]">
            {/* <ReactPlayer
              // className="h-full w-full"
              url={otherStream}
              width="100%"
              height="100%"
              playing
            /> */}
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            ) : null}
          </div>
        </div>
        <div className="bg-[#00ADB5] h-[5%] w-[100%] flex items-center p-2 rounded-b-lg">
          <h1 className="mr-2 font-medium">Room Code: </h1>
          <span className="mr-2">{code}</span>
        </div>
      </div>
      <div className="bg-[#EEEEEE] flex flex-col justify-between mt-6 sm:mt-0 w-[100%] h-[60vh] sm:h-[95vh] sm:w-[74vw]">
        <CodeEditArea />
        {/* {user.name} connected to {otherTempStream} */}
      </div>
    </div>
  );
};

export default Main;
