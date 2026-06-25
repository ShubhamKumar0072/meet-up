import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SetUp from './pages/SetUp'
import MyPrfile from './pages/MyProfile'
import Navbar from './components/Navbar'
import ChatPage from './pages/ChatPage'
import Settings from './pages/Settings'
import LandingPage from './pages/LandingPage'

import { useEffect, useState } from 'react'
import axios from "axios";

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {

        const url = new URL(window.location.href);
        const urlToken = url.searchParams.get("token");

        if (urlToken) {
          localStorage.setItem("token", urlToken);

          // remove token from URL (clean + safe)
          window.history.replaceState({}, document.title, "/");
        }

        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
         import.meta.env.VITE_API_URL + "/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUser(response.data.user);

      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();

  }, []);

  // console.log(user);
  // console.log(loading);

  const isAuthenticated = !!user;
  const isSetupComplete = user?.isSetupComplete;

  if (loading) {
    return <h1>Loading ...</h1>
  }

  return (
    <div className="app">
      {user && <Navbar />}
      <div className="pages">
        <Routes>

          <Route
            path="/"
            element={
              !isAuthenticated
                ? <LandingPage />
                : isSetupComplete
                  ? <Navigate to="/chat" replace />
                  : <Navigate to="/setup" replace />
            }
          />

          <Route
            path="/setup"
            element={
              isAuthenticated
                ? (isSetupComplete ? <Navigate to="/chat" /> : <SetUp />)
                : <Navigate to="/" />
            }
          />


          <Route
            path="/chat"
            element={
              isAuthenticated
                ? (isSetupComplete ? <ChatPage /> : <Navigate to="/setup" />)
                : <Navigate to="/" />
            }
          />

          <Route
            path="/setting"
            element={
              isAuthenticated
                ? <Settings />
                : <Navigate to="/" />
            }
          />

          <Route
            path="/profile"
            element={
              isAuthenticated
                ? <MyPrfile />
                : <Navigate to="/" />
            }
          />


        </Routes>


      </div>
    </div>
  )
}

export default App
