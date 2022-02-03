import React, { useState, SyntheticEvent } from "react";
import axios from 'axios';
import styled from "styled-components";
import { Form, Button } from "react-bootstrap";
import { device } from "../../styles/devices";
import { routes } from '../../util/config';
//import { useHistory } from "react-router-dom";
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

const StyledText = styled(Form.Group)`
  @media ${device.mobileS} {
    width: 100%;
    color: white;
    text-align: center;
  }
  @media ${device.laptopL} {
    width: 100%;
    color: white;
    text-align: center;
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

export const VerifyUserForm = (): JSX.Element => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [verified, setVerified] = useState(false);

    //const history = useHistory();

    function validateUserFields(){
        return (
            username.length > 0 && email.length > 0
        ); //makes sure the user enters something in each field
    }

    function handleVerifyUser(event: SyntheticEvent){
        event.preventDefault();
    
        const userInfo = {
            username: username,
            email: email,
        };

        const sendVerifyInfoRequest = async () => {
            try{
                const resp = await axios.post(routes.verifyUser, userInfo);
                console.log(resp.data);
                if (resp.data === "Success") {
                    alert("Follow the link sent to your email to reset your password");
                    setVerified(true);
                    //history.push("/reset/resetPassword");
                } else if (resp.data === "Failed") {
                    alert("Invalid username or email");
                }
            }catch (err) {
                alert("Reset Password failed");
                //Handle Error Here
                console.error(err);
            }
          };
          sendVerifyInfoRequest();
    }

    return(
        <div className="VerifyUser">
          {!verified && (
            <>
               <StyledForm>
               <Row>
               <Col span={8} xs={6} md={8}></Col>
               <Col span={8} xs={12} md={8}>
               <StyledInput>
                   <Form.Group controlId="username">
                   <StyledLabel>Username</StyledLabel>
                   <Form.Control 
                       autoFocus
                       required
                       type="text" 
                       value={username} 
                       onChange={(e) => setUsername(e.target.value)}
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
               <Form.Group controlId="email">
               <StyledLabel>Email</StyledLabel>
               <Form.Control 
                   required
                   type="email" 
                   value={email} 
                   onChange={(e) => setEmail(e.target.value)}
               />
               </Form.Group>
               </StyledInput>
               </Col>
               <Col span={8} xs={6} md={8}></Col>
               </Row>
             </StyledForm>
             <Row>
             <Col span={8} xs={6} md={8}></Col>
             <StyledUpdateButton 
                 variant="success"
                 type="button" 
                 disabled={!validateUserFields()} 
                 onClick={handleVerifyUser}
             >
             Verify
             </StyledUpdateButton>
             </Row> 
             </>
          )}
          {verified && (
            <StyledForm>
              <Row>
               <Col span={8} xs={6} md={8}></Col>
               <Col span={8} xs={12} md={8}>
               <StyledText>You can now close this page</StyledText>
               </Col>
               <Col span={8} xs={6} md={8}></Col>
               </Row>
            </StyledForm>
          )}
        </div>
    );
}