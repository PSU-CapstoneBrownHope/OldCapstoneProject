// import { useState } from 'react'
import styled from "styled-components";
import bhLogo from "../../images/brownHopeGrey.png";
import { Row, Col } from "antd";
import { device } from "../../styles/devices";
import { LoginForm } from "./Index";
//import { Navbar } from "../Index";


const StyledbhLogoContainer = styled.div`
  text-align: center;
  margin: auto;
  margin-top: 10rem;
  margin-bottom: 2rem;
  @media ${device.mobileS} {
    width: 200px;
  }

  @media ${device.laptop} {
    width: 300px;
  }
`;
const StyledbhLogo = styled.img`
  width: 100%;
  height: auto;
`;

export const Login = (): JSX.Element => {
  return (
    <div>
      <Row>
        <Col span={8}></Col>
        <Col span={8}>
          <StyledbhLogoContainer>
            <StyledbhLogo src={bhLogo}></StyledbhLogo>
          </StyledbhLogoContainer>
          <LoginForm></LoginForm>
        </Col>
        <Col span={8}></Col>
      </Row>
    </div>
  );
};
