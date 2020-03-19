import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Routes } from "../../routes";
import { FirebaseContext } from "../../firebase";

const SignOutButton = () => {
  const firebase = useContext(FirebaseContext);
  const history = useHistory();

  const onClick = () => {
    firebase?.signOut().then(() => {
      history.push(Routes.Landing);
    });
  };

  return (
    <Button variant="contained" color="primary" type="button" onClick={onClick}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
