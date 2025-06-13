import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./bootstrap.min.css";
import Home from "./elements/Home";
import Register from "./elements/Register";
import Login from "./elements/login";
import Contact from "./elements/Contact";
import NavS from "./elements/Nav";
import Game1 from "./elements/NumberGuessing";
import Game2 from "./elements/RockPaperScissors";
import Game from "./elements/Game";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem("username") !== null);
  }, []);

  return (
    <BrowserRouter>
      <NavS isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/NumberGuessing" element={<Game1 />} />
        <Route path="/RockPaperScissors" element={<Game2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
