import React, { useState, SyntheticEvent } from "react";
import axios from 'axios';
import styled from "styled-components";
import { Form, Button } from "react-bootstrap";
import { device } from "../../styles/devices";
import { routes } from '../../util/config';
import { useHistory } from "react-router-dom";
import { Row, Col } from "antd";

const StyledForm = styled(Form)`
  margin: auto;
  padding-top: 5%;
  @media ${device.mobileS} {
    font-size: 14px;
  }

  @media ${device.laptopL} {
    font-size: 16px; 
  }
`;

const StyledInput = styled(Form.Group)`
  // These are no longer needed but keeping in case we want to re-style inputs.
  @media ${device.mobileS} {
    width: 100%;
  }
  @media ${device.laptopL} {
    width: 100%;
  }
`;

const StyledLabel = styled(Form.Label)`
  color: white;
  @media ${device.mobileS} {
    font-size: 14px;
  }

  @media ${device.laptopL} {
    font-size: 16px;
  }
`;

const StyledUpdateButton = styled(Button)` 
@media ${device.mobileS} {
  font-size: 14px;
}

@media ${device.laptopL} {
  font-size: 16px;
}
`;

export const UpdatePasswordForm = (): JSX.Element => {
  //const [username, setUsername] = useState("");
  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [new_password_verify, setVerifyNewPassword] = useState("");

  const history = useHistory();

  function validatePasswordChange(){
    return (
      /*username.length > 0 && */old_password.length > 0 && new_password.length > 0 && new_password === new_password_verify && new_password !== old_password
    ); //makes sure the user enters something in each field and that the new password was typed correctly
  }

  function getUsername() {
    if (sessionStorage.getItem('username') == null)
    {
      alert('Not logged in. Redirecting to login page...')
      history.push('/');
    }
    return sessionStorage.getItem('username');
  }

  function handleUpdatePassword(event: SyntheticEvent){
    event.preventDefault();

    const newUserPassword = {
      //username: username,
      new_password: new_password,
      old_password: old_password,
      new_password_verify: new_password_verify,
    };

    const sendUpdateRequest = async () => {
      try{
        const resp = await axios.post(routes.updatePassword, newUserPassword, { withCredentials: true });
        console.log(resp.data);
        if (resp.data === "Success") {
          alert("Password Update Successful!");
          history.push("/");
        } else if (resp.data === "Failed") {
          alert("Sorry, wrong username or password. Please try again!")
        }
      }catch (err) {
        alert("Password change failed");
        // Handle Error Here
        console.error(err);
      }
    };
    sendUpdateRequest();
  }
 
  return (
    <div className="UpdatePassword"> 
      <StyledForm>
      <Row>
      <Col span={8} xs={6} md={8}></Col>
      <Col span={8} xs={12} md={8}>
      <StyledInput>
        <Form.Group controlId="username">
          <StyledLabel>Username: {getUsername()}</StyledLabel>
        </Form.Group>
        </StyledInput>
        </Col>
        <Col span={8} xs={6} md={8}></Col>
        </Row>
        <Row>
        <Col span={8} xs={6} md={8}></Col>
        <Col span={8} xs={12} md={8}>
        <StyledInput>
        <Form.Group controlId="oldPassword">
          <StyledLabel>Old Password</StyledLabel>
          <Form.Control 
            autoFocus
            type="password" 
            value={old_password} 
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Form.Group>
        </StyledInput>
        </Col>
        <Col span={8} xs={6} md={8}></Col>
        </Row>
        <Row>
        <Col span={8} xs={6} md={8}></Col>
        <Col span={8} xs={12} md={8}>
        <StyledInput>
        <Form.Group controlId="newPassword">
          <StyledLabel>New Password</StyledLabel>
          <Form.Control 
            type="password" 
            value={new_password} 
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>
        </StyledInput>
        </Col>
        <Col span={8} xs={6} md={8}></Col>
        </Row>
        <Row>
        <Col span={8} xs={6} md={8}></Col>
        <Col span={8} xs={12} md={8}>
        <StyledInput>
        <Form.Group controlId="verifyNewPassword">
          <StyledLabel>Verify New Password</StyledLabel>
          <Form.Control 
            type="password" 
            value={new_password_verify} 
            onChange={(e) => setVerifyNewPassword(e.target.value)}
          />
        </Form.Group>
        </StyledInput>
        </Col>
        <Col span={8} xs={6} md={8}></Col>
        </Row>
        <Row>
        <Col span={8} xs={6} md={8}></Col>
        <StyledUpdateButton 
          variant="success"
          type="submit" 
          disabled={!validatePasswordChange()} 
          onClick={handleUpdatePassword}
          >
          Update
        </StyledUpdateButton>
        </Row>
      </StyledForm>
    </div>
  );
};