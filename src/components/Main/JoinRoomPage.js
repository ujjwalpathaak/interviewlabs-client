import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { usePeer } from "../../context/Peer";
import { uniqueIdGenerator } from "../../utils/uniqueIdGenerator";
import { SocketContext } from "../../context/Socket";
import { selectUser } from "../../provider/userSlice";
import axios from "axios";
import Peer from "simple-peer";
// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const BACKEND_URL = process.env.REACT_APP_DEVELOPMENT_BACKEND_URL;

const JoinRoomPage = ({ setCode }) => {
  const { socket, socketId } = useContext(SocketContext);
  const user = useSelector(selectUser);
  let name = user.name;
  const [roomId, setRoomId] = useState();
  const navigate = useNavigate();

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
    // name,
    // setName,
    myVideo,
    userVideo,
    connectionRef,
  } = usePeer();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });
    setMe(socketId);
  }, []);

  const createNewRoom = async () => {
    let tempRoomId = uniqueIdGenerator();
    setRoomId(tempRoomId);
    const newRoomDataTemplate = {
      roomId: tempRoomId,
      owner: name,
      ownerId: user._id,
      ownerSocketId: socketId || "temp",
    };
    let newRoomData = await axios.post(
      `${BACKEND_URL}/createRoom`,
      newRoomDataTemplate
    );
    // console.log(newRoomData);
    setCode(tempRoomId);
    navigate(`/room/${tempRoomId}`);
  };

  const callUser = (id) => {
    console.log("call user");
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const joinRoom = async () => {
    if (!roomId) {
      window.alert("Please Fill in Room Id");
      return;
    }
    const oldRoomDataTemplate = {
      roomId: roomId,
      joiner: name,
      joinerId: user._id,
    };
    const oldRoomId = {
      roomId: roomId,
    };
    let ownerSocketId = await axios.post(
      `${BACKEND_URL}/getSocketId`,
      oldRoomId
    );
    // console.log(ownerSocketId.ownerSocketId);
    console.log(ownerSocketId.data);
    callUser(ownerSocketId.data);

    // add

    await axios.post(`${BACKEND_URL}/joinRoom`, oldRoomDataTemplate).then(
      (response) => {
        console.log(response);
        setCode(roomId);
        navigate(`/room/${roomId}`);
      },
      (error) => {
        window.alert("Room not found");
        console.log("Room already exists -> " + error);
      }
    );
  };

  const handleEnterKey = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="absolute z-[2] w-[100%] h-[100%] bg-[#EEEEEE] flex justify-center items-center flex-col sm:flex-row">
      <div className="w-[60%] h-[100%] flex flex-col justify-center items-center">
        <button
          onClick={createNewRoom}
          className="text-3xl m-2 mb-7 bg-transparent hover:bg-[#00ADB5] text-[#00ADB5] font-semibold hover:text-white py-2 px-4 border border-[#00ADB5] hover:border-transparent rounded-full"
        >
          New Session
        </button>
        <input
          type="text"
          className="
          form-control
          block
          w-10%
          px-3
          py-1.5
          text-xl
          font-normal
          text-[#393E46]
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded-full
          transition
          ease-in-out
          m-0
          focus:text-[#393E46] focus:bg-white focus:border-[#00ADB5] focus:outline-none
          "
          id="exampleText0"
          placeholder="Already have a code?"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          onKeyUp={handleEnterKey}
        />
        <button
          onClick={joinRoom}
          className="text-3xl m-2 bg-transparent hover:bg-[#00ADB5] text-[#00ADB5] font-semibold hover:text-white py-2 px-4 border border-[#00ADB5] hover:border-transparent rounded-full"
        >
          Join Session
        </button>
        <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          style={{ width: "300px" }}
        />
      </div>
    </div>
  );
};

export default JoinRoomPage;
