import React, { useState, SyntheticEvent } from "react";
import styled from "styled-components";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { routes } from "../../util/config";

const StyledForm = styled(Form)`
  width: 100%;
  margin: auto;
`;
const StyledLabel = styled(Form.Label)`
  color: white;
`;

const StyledSignupLoginContainer = styled.div`
  margin-top: 20px;
  display: flex;
`;
const StyledLoginButton = styled(Button)`
  width: 50%;
`;

const StyledSignupButton = styled(Button)`
  width: 50%;
`;

const StyledSignUpSubmitButton = styled(Button)`
  margin-top: 10px;
`;

export const LoginForm = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [signUpState, setSignUpState] = useState(false);

  const history = useHistory();
  const handleClick = () => history.push("/reset/verify-user");

  function validateForm() {
    return username.length > 0 && password.length > 0 && !signUpState;
  }

  function validateSignUp() {
    return (
      password === verifyPassword && email.length > 0 && username.length > 0
    );
  }

  function handleLoginSubmit(event: SyntheticEvent) {
    event.preventDefault();

    const newLoginRequest = {
      username: username,
      password: password,
    };

    // Was added for testing navbar, but may actually work for future use
    function setUsername() {
      return sessionStorage.setItem('username', newLoginRequest.username);
    }

    const sendLoginRequest = async () => {
      try {
        const resp = await axios.post(routes.login, newLoginRequest, { withCredentials: true });
        console.log(resp.data);
        if (resp.data === "Success") {
          setUsername(); // added for testing navbar
          history.push("/landing");
        } else if (resp.data === "Failed") {
          alert("Sorry, wrong username or password. Please try again!")
        }
      } catch (err) {
        // Handle Error Here
        console.error(err);
        alert("Login Failed");
      }
    };
    sendLoginRequest();
  }

  function handleSignupSubmit(event: SyntheticEvent) {
    const newSignupRequest = {
      username: username,
      email: email,
      password: password,
    };

    const sendSignupRequest = async () => {
      try {
        const resp = await axios.post(routes.signup, newSignupRequest);
        console.log(resp.data);
        if (resp.data === "Success") {
          alert("Account Creation Successful! Redirecting to login")
          history.push("/");
          setSignUpState(false);
          setUserName("");
          setPassword("");
        } else if (resp.data === "Email Already Exists") {
          alert("Sorry, user already exists")
        }
        else if (resp.data === "Emailed") {
          alert("This email already exists in our system. To claim your account, please follow the link emailed to you.")
        }
      } catch (err) {
        alert("Sign up failed");
        // Handle Error Here
        console.error(err);
      }
    };
    sendSignupRequest();
  }

  return (
    <div className="Login">
      <StyledForm>
        <Form.Group controlId="username">
          <StyledLabel>Username</StyledLabel>
          <Form.Control
            autoFocus
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Group>
        {!signUpState && (
          <Form.Group controlId="password">
            <StyledLabel>Password</StyledLabel>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        )}
        {signUpState && (
          <>
            <Form.Group controlId="email">
              <StyledLabel>Email</StyledLabel>
              <Form.Control
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <StyledLabel>Password</StyledLabel>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <StyledLabel>Confirm Password</StyledLabel>
              <Form.Control
                type="password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
            </Form.Group>
            <StyledSignUpSubmitButton
              type="button"
              disabled={!validateSignUp()}
              onClick={handleSignupSubmit}
            >
              Submit
            </StyledSignUpSubmitButton>
          </>
        )}
        <StyledSignupLoginContainer>
          <StyledLoginButton
            variant="success"
            type = "submit"
            disabled={!validateForm()}
            onClick={handleLoginSubmit}
          >
            Login
          </StyledLoginButton>
          <StyledSignupButton
            name="signup-button"
            variant={signUpState ? "success" : "outline-success"}
            onClick={(e: SyntheticEvent) => {
              if (signUpState) {
                setSignUpState(false);
              } else {
                setSignUpState(true);
              }
            }}
          >
            Sign Up
          </StyledSignupButton>
        </StyledSignupLoginContainer>
        <StyledSignupLoginContainer>
        <StyledSignupButton
            variant="success"
            type="button"
            onClick={handleClick}
          >
            Forgot Password
          </StyledSignupButton>
        </StyledSignupLoginContainer>
        
      </StyledForm>
    </div>
  );
};
