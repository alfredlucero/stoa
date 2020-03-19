import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Routes } from "../../../routes";
import { FirebaseContext } from "../../../firebase";

const LoginPage = () => {
  const firebase = useContext(FirebaseContext);
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    firebase
      ?.signInWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoggingIn(false);
        setIsLoginError(false);
        history.push(Routes.Home);
      })
      .catch(error => {
        console.error("Failed to login error: ", error);
        setIsLoggingIn(false);
        setIsLoginError(true);
      });
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const isLoginButtonDisabled = email === "" || password === "" || isLoggingIn;

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <TextField
          id="email"
          type="text"
          label="Email Address"
          value={email}
          onChange={onChangeEmail}
          variant="filled"
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={onChangePassword}
          variant="filled"
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoginButtonDisabled}
        >
          {isLoggingIn && <>Logging in...</>}
          {!isLoggingIn && <>Log In</>}
        </Button>
      </form>
      {isLoginError && (
        <p>
          Failed to log in! Please make sure your email and password are
          correct.
        </p>
      )}
      <p>
        Don't have an account? <Link to={Routes.Login}>Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
