import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import ForgotPassword from "./components/Login/ForgotPassword";
import NavBar from "./components/landingPageComponents/NavBar";
import LandingPage from "./components/landingPageComponents/LandingPage";
import ViewProfile from "./components/profile/ViewProfile";
import SearchProfile from "./components/profile/SearchProfile";
import Lobby from "./components/GameLobby/Lobby";
import Chat from "./components/ChatComponents/Chat";
import GameInstructions from "./contexts/GameInstructions";
import happyCat from "./assets/avatars/happyCat.png";

// * SOCKET FILE *
import { socket, emitters } from "./socket.js";
import GameRoom from "./components/GameComponents/GameRoom";

function App() {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({});
  const [user, setUser] = useState(false);
  const [inGameProfiles, setInGameProfiles] = useState();

  socket.on("joined", (data) => {
    setInGameProfiles(data);
  });

  // USER LOGIN
  const getUserData = async (user) => {
    emitters.getUserData(user);
    setUser(true);
  };

  // USER SIGN-UP
  const createNewUser = async (user) => {
    emitters.createUser(user);
    setUser(true);
  };

  // LOGOUT BTN CLICKED
  const logout = () => {
    localStorage.removeItem("u_id");
    setUserInfo({});
    setUser(false);
  };

  // SOCKET LISTENERS
  socket.on("send-user-data", (data) => {
    setUserInfo(data[0]);
    localStorage.setItem("u_id", data[0].firebase_id);
  });

  // CHECK TO SEE IF USER IS LOGGED IN
  useEffect(() => {
    if (localStorage.getItem("u_id") === "null")
      localStorage.removeItem("u_id");
    const user = { firebase_id: localStorage.getItem("u_id") };
    const guest = "Guest" + Math.floor(Math.random() * 1000000).toString();
    if (user.firebase_id) {
      getUserData(user);
      setUser(true);
    } else {
      setUserInfo({ username: guest, avatar: happyCat });
    }
  }, [user]);

  return (
    <>
      {location.pathname !== "/game" ? (
        <NavBar userInfo={userInfo} user={user} logout={logout} />
      ) : null}
      <Routes>
        <Route
          path="/"
          element={<LandingPage userInfo={userInfo} user={user} />}
        ></Route>
        <Route
          path="/game"
          element={
            <GameRoom inGameProfiles={inGameProfiles} userInfo={userInfo} />
          }
        ></Route>
        <Route
          path="/login"
          element={<Login getUserData={getUserData} />}
        ></Route>
        <Route
          path="/signup"
          element={<Signup createNewUser={createNewUser} />}
        ></Route>
        <Route
          path="/profile"
          element={<ViewProfile userInfo={userInfo} />}
        ></Route>
        <Route
          path="/profile/search"
          element={<SearchProfile userInfo={userInfo} />}
        ></Route>
        <Route path="/instructions" element={<GameInstructions />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route
          path="/lobby"
          element={
            <Lobby inGameProfiles={inGameProfiles} userInfo={userInfo} />
          }
        ></Route>
        <Route path="/chat" element={<Chat />}></Route>
      </Routes>
    </>
  );
}

export default App;
