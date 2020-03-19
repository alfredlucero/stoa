import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Routes } from "../../../routes";
import { FirebaseContext } from "../../../firebase";

const SignupPage = () => {
  const firebase = useContext(FirebaseContext);
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSignupError, setIsSignupError] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSigningUp(true);
    firebase
      ?.createUserWithEmailAndPassword(email, password)
      .then(createdUser => {
        console.log("Created user: ", createdUser);
        setIsSigningUp(false);
        setIsSignupError(false);
        history.push(Routes.Home);
      })
      .catch(error => {
        console.error("Sign up error: ", error);
        setIsSigningUp(false);
        setIsSignupError(true);
      });
  };

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const isSignUpButtonDisabled =
    username === "" ||
    email === "" ||
    password === "" ||
    password !== confirmPassword ||
    isSigningUp;

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={onSubmit}>
        <TextField
          id="username"
          type="text"
          label="Username"
          value={username}
          onChange={onChangeUsername}
          variant="filled"
        />
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
        <TextField
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          variant="filled"
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isSignUpButtonDisabled}
        >
          {isSigningUp && <>Signing up...</>}
          {!isSigningUp && <>Sign Up</>}
        </Button>
      </form>
      {isSignupError && <p>Failed to sign up your user!</p>}
      <p>
        Already have an account? <Link to={Routes.Login}>Log In</Link>
      </p>
    </div>
  );
};

export default SignupPage;
