import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { createdRoom, joinedRoom } from "../../provider/roomSlice";
import illus from "../../assets/illus2.png";
import { uniqueIdGenerator } from "../../utils/uniqueIdGenerator";
import { SocketContext } from "../../context/Socket";
import { selectUser } from "../../provider/userSlice";
import { selectRoom } from "../../provider/roomSlice";
import { usePeer } from "../../context/Peer";
import { createRoom, joinRoom, getRoom } from "../../service/roomApi";
 
const JoinRoomPage = ({ setCode }) => {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const room = useSelector(selectRoom);
  const [roomId, setRoomId] = useState();
  const [data, setData] = useState({});
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.current.emit("get-me", {});
    socket.current.on("me", (id) => {
      setUserId(id)
    });
  }, []);

  const createNewRoom = () => {
    let tempRoomId = uniqueIdGenerator();
    setRoomId(tempRoomId);
    dispatch(
      createdRoom({
        id: tempRoomId,
        owner: user.name,
      })
    );
    setData({
      roomId: tempRoomId,
      owner: user.name,
      ownerId: userId,
    })
    console.log(data)
    createRoom(data);
    setCode(tempRoomId);
    navigate(`/room/${tempRoomId}`);
  };

  const joinRoom = () => {
    if (!roomId) {
      window.alert("Please Fill in Room Id");
      return;
    }
    // dispatch(
    //   joinedRoom({
    //     joiner: user.name,
    //   })
    // );
    let data2 = {
      roomId: roomId,
      joiner: user.name,
      joinerId: userId,
    };
    joinRoom(data2);
    setCode(roomId);
    navigate(`/room/${roomId}`);
  };

  const handleEnterKey = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="absolute z-[2] w-[100%] h-[100%] bg-[#EEEEEE] flex justify-center items-center flex-col sm:flex-row">
      <div className="w-[100%] h-[100%] flex justify-center items-center sm:w-[50%] sm:h-[100%] ">
        <img className="w-[100%]" src={illus} alt="illus" />
      </div>
      <div className="w-[50%] h-[100%] flex flex-col justify-center items-center">
        <button
          onClick={createNewRoom}
          className="text-2xl m-2 mb-7 bg-transparent hover:bg-[#00ADB5] text-[#00ADB5] font-semibold hover:text-white py-2 px-4 border border-[#00ADB5] hover:border-transparent rounded-full"
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
          text-base
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
          className="text-xl m-2 bg-transparent hover:bg-[#00ADB5] text-[#00ADB5] font-semibold hover:text-white py-2 px-4 border border-[#00ADB5] hover:border-transparent rounded-full"
        >
          Join Session
        </button>
      </div>
    </div>
  );
};

export default JoinRoomPage;
