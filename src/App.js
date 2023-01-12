import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUser } from "./provider/userSlice";
import Homepage from "./pages/Homepage";
import Main from "./pages/Main";
import JoinRoomPage from "./components/Main/JoinRoomPage";

import "./App.css";

function App() {
  const user = useSelector(selectUser);
  const [code, setCode] = useState();

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={user ? <JoinRoomPage setCode={setCode} /> : <Homepage />}
        />
        <Route path="/room/:roomId" element={<Main code={code} />} />
      </Routes>
    </div>
  );
}

export default App;
