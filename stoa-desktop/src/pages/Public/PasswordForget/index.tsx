import React, { useContext, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { FirebaseContext } from "../../../services/firebase";

const PasswordForgetPage = () => {
  const firebase = useContext(FirebaseContext);

  const [email, setEmail] = useState("");
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const [
    isProcessingPasswordResetEmail,
    setIsProcessingPasswordResetEmail,
  ] = useState(false);
  const [
    isPasswordResetEmailSentSuccess,
    setIsPasswordResetEmailSentSuccess,
  ] = useState(false);
  const [
    isPasswordResetEmailSentError,
    setIsPasswordResetEmailSentError,
  ] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessingPasswordResetEmail(true);

    firebase
      .sendPasswordResetEmail(email)
      .then(() => {
        setIsPasswordResetEmailSentSuccess(true);
        setIsPasswordResetEmailSentError(false);
        setIsProcessingPasswordResetEmail(false);
      })
      .catch(() => {
        setIsPasswordResetEmailSentSuccess(false);
        setIsPasswordResetEmailSentError(true);
        setIsProcessingPasswordResetEmail(false);
      });
  };

  const isResetMyPasswordButtonDisabled = email === "";

  return (
    <div>
      <h2>Forgot your Password?</h2>
      <form onSubmit={onSubmit}>
        <TextField
          id="email"
          type="text"
          label="Email Address"
          value={email}
          onChange={onChangeEmail}
          variant="filled"
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isResetMyPasswordButtonDisabled}
        >
          {isProcessingPasswordResetEmail && <>Processing...</>}
          {!isProcessingPasswordResetEmail && <>Reset your Password</>}
        </Button>
      </form>
      {isPasswordResetEmailSentSuccess && (
        <p>
          Successfully sent a password reset email to your inbox. Please go
          there and update your password.
        </p>
      )}
      {isPasswordResetEmailSentError && (
        <p>Failed to reset your password through email.</p>
      )}
    </div>
  );
};

export default PasswordForgetPage;
