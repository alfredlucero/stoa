import React from "react";
import { Link } from "react-router-dom";
import SignOutButton from "../SignOutButton";
import { Routes } from "../../routes";
import { useAuthSession } from "../../auth";

const Navigation = () => {
  const { user } = useAuthSession();
  return <div>{user ? <AuthNavigation /> : <PublicNavigation />}</div>;
};

const PublicNavigation = () => {
  return (
    <>
      <Link to={Routes.Landing}>Landing</Link>
      <Link to={Routes.Login}>Login</Link>
      <Link to={Routes.Signup}>Signup</Link>
    </>
  );
};

const AuthNavigation = () => {
  return (
    <>
      <Link to={Routes.Home}>stoa</Link>
      <Link to={Routes.Standups}>standups</Link>
      <Link to={Routes.Profile}>profile</Link>
      <SignOutButton />
    </>
  );
};

export default Navigation;
