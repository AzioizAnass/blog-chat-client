import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Chat from "./pages/Chat.tsx";
import Blog from "./pages/Blog.tsx";
import "./App.css";

const App = () => {

  return (
    <AuthProvider children={
    <Router><div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Blog />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/blog" element={<Blog />} />
        </Route>
      </Routes></div>
    </Router>}/>
  );
};

export default App;
