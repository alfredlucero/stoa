import React from "react";
import { Router } from "react-router-dom";
// Components
import AuthRoute from "./components/Routes/AuthRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import Navigation from "./components/Navigation";
// Public Pages
import LandingPage from "./pages/Public/Landing";
import LoginPage from "./pages/Public/Login";
import SignupPage from "./pages/Public/Signup";
import PasswordForgetPage from "./pages/Public/PasswordForget";
// Auth Pages
import HomePage from "./pages/Auth/Home";
import FilterPage from "./pages/Auth/Filter";
import ProfilePage from "./pages/Auth/Profile";
// Auth
import { useAuth, UserContext } from "./auth";
// Utils
import hashHistory from "./hashHistory";
import { Routes } from "./routes";

const App = () => {
  const { user } = useAuth();
  console.log("User: ", user);

  return (
    <UserContext.Provider value={user}>
      <Router history={hashHistory}>
        <Navigation />

        <PublicRoute path={Routes.Landing}>
          <LandingPage />
        </PublicRoute>
        <PublicRoute path={Routes.Login}>
          <LoginPage />
        </PublicRoute>
        <PublicRoute path={Routes.Signup}>
          <SignupPage />
        </PublicRoute>
        <PublicRoute path={Routes.PasswordForget}>
          <PasswordForgetPage />
        </PublicRoute>

        <AuthRoute path={Routes.Home}>
          <HomePage />
        </AuthRoute>
        <AuthRoute path={Routes.Filter}>
          <FilterPage />
        </AuthRoute>
        <AuthRoute path={Routes.Profile}>
          <ProfilePage />
        </AuthRoute>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
