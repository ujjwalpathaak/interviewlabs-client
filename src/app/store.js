import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../provider/userSlice";
// import roomRed ucer from "../context/roomSlice";

// export default configureStore({
//   reducer: {
//     user: userReducer,
//     room: roomReducer
//   },
// });

const store = configureStore({
  reducer: {
    user: userReducer,
  }
});

export default store;