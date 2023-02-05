import React, { useEffect, useCallback, useState, useContext } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import Peer from "simple-peer";
import CodeEditArea from "../components/Main/CodeEditArea";
import { usePeer } from "../context/Peer";
import { SocketContext } from "../context/Socket";
import { selectUser } from "../provider/userSlice";
import { useNavigate } from "react-router-dom";
const Main = ({ code }) => {
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const [mystream, setMyStream] = useState(null);
  const user = useSelector(selectUser);
  const [otherTempStream, setOtherTempStream] = useState(null);
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
  useEffect(() => {
    socket.current.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
    myVideo.current.srcObject = stream;
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.current.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    navigate(`/newRoom`);
  };

  return (
    <div className="bg-[#EEEEEE] w-[100vw] h-[100vh] flex flex-col sm:justify-around items-center sm:p-2 sm:flex-row">
      <div className="w-full h-[30vh] flex-col sm:rounded-lg sm:h-[95vh] sm:mr-2 sm:w-[24vw] sm:min-w-[350px]">
        <div className="bg-[#393E46] w-[100%] h-full flex flex-row justify-start sm:h-[92%] sm:flex-col sm:justify-between sm:p-4 sm:min-h-[550px] rounded-t-lg">
          <div className="h-[50%]">
            {/* <div className=" bg-white min-h-[250px] h-full w-[50%] sm:rounded-lg sm:w-[100%] sm:h-[85%]"> */}
            <div className="bg-white min-h-[250px] h-full w-[50%] sm:rounded-lg sm:w-[100%] sm:h-[85%]">
              {stream && (
                <video
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  style={{ width: "100%" }}
                />
              )}
              // {/* </div> */}
            </div>
            <p className="font-medium text-slate-100 m-2">{user.name}</p>
          </div>
          <div className="h-[50%]">
            {/* <div className="min-h-[250px] bg-white h-full w-[50%] sm:rounded-lg sm:w-[100%] sm:h-[85%]"> */}
            <div className="min-h-[250px] bg-white h-full w-[50%] sm:rounded-lg sm:w-[100%] sm:h-[85%]">
              {callAccepted && !callEnded ? (
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  style={{ width: "100%" }}
                />
              ) : null}
            </div>
            {/* </div> */}
            <p className="font-medium text-slate-100 m-2">{otherTempStream}</p>
          </div>
        </div>
        <div className="bg-[#00ADB5] h-[6%] w-[100%] flex items-center p-2 rounded-b-lg">
          <h1 className="mr-2 font-medium">Room Code: </h1>
          <span className="mr-2">{code}</span>

          <button
            className="ml-3 border p-1 hover:bg-[#f15641] rounded-lg text-slate-100 font-bold"
            onClick={leaveCall}
          >
            Leave Call
          </button>
        </div>
      </div>
      {receivingCall && !callAccepted ? (
        <div className="z-[2] absolute bg-[#00ADB5] p-2 rounded-lg text-slate-100 font-bold ">
          <div className="flex justify-center items-center">
            <p>{name} wants to join the call</p>
            <button
              className="ml-3 border p-1 hover:bg-[#393E46] rounded-lg"
              onClick={answerCall}
            >
              Accept
            </button>
          </div>
        </div>
      ) : null}
      <div className="bg-[#EEEEEE] flex flex-col justify-between mt-6 sm:mt-0 w-[100%] h-[60vh] sm:h-[95vh] sm:w-[74vw]">
        <CodeEditArea />
      </div>
    </div>
  );
};

export default Main;
