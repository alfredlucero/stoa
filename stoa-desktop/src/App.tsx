import React from "react";
import { Router, Route, Link } from "react-router-dom";
// Components
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import PasswordForgetPage from "./pages/PasswordForget";
import HomePage from "./pages/Home";
import SearchAppBar from "./components/SearchAppBar";
import InteractiveList from "./components/InteractiveList";
import SignOutButton from "./components/SignOutButton";
// Utils
import hashHistory from "./utils/hashHistory";
import { Routes } from "./utils/routes";

const App = () => {
  return (
    <Router history={hashHistory}>
      <Link to={Routes.Landing}>Landing</Link>
      <Link to={Routes.Login}>Login</Link>
      <Link to={Routes.Signup}>Signup</Link>
      <SignOutButton />

      <Route path={Routes.Landing} component={LandingPage} />
      <Route path={Routes.Login} component={LoginPage} />
      <Route path={Routes.Signup} component={SignupPage} />
      <Route path={Routes.PasswordForget} component={PasswordForgetPage} />
      <Route path={Routes.Home} component={HomePage} />
    </Router>
  );
};

export default App;
