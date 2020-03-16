import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { Routes } from "../../utils/routes";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSignupError, setIsSignupError] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div>
      <h2>Signup</h2>
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
        <TextField
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          variant="filled"
        />
      </form>
      <p>
        Already have an account? <Link to={Routes.Login}>Log In</Link>
      </p>
    </div>
  );
};

export default SignupPage;
