import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuthSession } from "../../auth";
import { Routes } from "../../routes";

interface AuthRouteProps extends Pick<RouteProps, "exact" | "path"> {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, ...routeProps }) => {
  const { user } = useAuthSession();

  return (
    <Route {...routeProps}>
      {user ? children : <Redirect to={Routes.Login} />}
    </Route>
  );
};

export default AuthRoute;
