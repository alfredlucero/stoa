import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { Routes } from "../../utils/routes";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

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
      </form>
      <p>
        Don't have an account? <Link to={Routes.Login}>Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
