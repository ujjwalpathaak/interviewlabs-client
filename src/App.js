import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";

import { selectUser } from "./provider/userSlice";
import SocketProvider from "./context/Socket";
import { PeerProvider } from "./context/Peer";
import Homepage from "./pages/Homepage";
import store from "./app/store";
import Main from "./pages/Main";
import JoinRoomPage from "./components/Main/JoinRoomPage";

import "./App.css";

function App() {
  const user = useSelector(selectUser);

  const [code, setCode] = useState();

  return (
    <Provider store={store}>
      <div className="App">
        <SocketProvider>
          <PeerProvider>
            <Routes>
              <Route
                path="/"
                element={
                  user ? <JoinRoomPage setCode={setCode} /> : <Homepage />
                }
              />
              <Route path="/room/:roomId" element={<Main code={code} />} />
            </Routes>
          </PeerProvider>
        </SocketProvider>
      </div>
    </Provider>
  );
}

export default App;
