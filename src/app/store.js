import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../provider/userSlice";
import roomReducer from "../provider/roomSlice";

// export default configureStore({
//   reducer: {
//     user: userReducer,
//     room: roomReducer
//   },
// });

const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
  }
});

export default store;