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

export const ResetPasswordForm = (): JSX.Element => {
  //const [token, setToken] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [password_verify, setVerifyNewPassword] = useState("");


  const history = useHistory();

  function validateFields(){
      return (
        new_password.length > 0 && new_password === password_verify
      ); //makes sure the user enters something in each field and password matches
  }

  function handleResetPassword(event: SyntheticEvent){
      event.preventDefault();

      let url = window.location.href;
      let urlArr = url.split('/');
      let token = urlArr[urlArr.length-1];
      console.log('URL: ', url);
      console.log('URL Array: ', urlArr);
      console.log('TOKEN: ', token);
  
      const userInfo = {
        token: token,
        new_password: new_password,
        password_verify: password_verify,
      };

      const sendResetRequest = async () => {
          try{
            console.log('User Token: ', userInfo.token)
            const resp = await axios.post(routes.resetPassword, userInfo);
            console.log(resp.data);
            if (resp.data === "Success") {
              alert("Password reset Successful. Redirecting to loggin...");
              history.push("/");
            } else if (resp.data === "Failed") {
              alert("Bad Token");
            }
          }catch (err) {
            alert("Password reset failed");
            // Handle Error Here
            console.error(err);
          }
        };
        sendResetRequest();
  }

  return(
    <div className="ResetPassword">
      <StyledForm>
      <Row>
      <Col span={8} xs={6} md={8}></Col>
      <Col span={8} xs={12} md={8}>
      <StyledInput>
      <Form.Group controlId="newPassword">
        <StyledLabel>New Password</StyledLabel>
        <Form.Control 
          required
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
          value={password_verify} 
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
        type="button" 
        disabled={!validateFields()} 
        onClick={handleResetPassword}
        >
        Submit
      </StyledUpdateButton>
      </Row>
      </StyledForm>
    </div>
  );
}