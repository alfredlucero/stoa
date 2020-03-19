import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuthSession } from "../../auth";
import { Routes } from "../../routes";

interface PublicRouteProps extends Pick<RouteProps, "exact" | "path"> {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  ...routeProps
}) => {
  const { user } = useAuthSession();

  return (
    <Route {...routeProps}>
      {!user ? children : <Redirect to={Routes.Home} />}
    </Route>
  );
};

export default PublicRoute;
