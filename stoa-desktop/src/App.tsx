import React from "react";
import { HashRouter, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import SearchAppBar from "./components/SearchAppBar";
import InteractiveList from "./components/InteractiveList";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Route path="/" exact component={HomePage} />
      <Route path="/login" exact component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
    </HashRouter>
  );
}

export default App;
