import styled from "styled-components";
import brfLogo from "../../images/brfLogo.png";
import { device } from "../../styles/devices";

// This component is under construction.

const StyledbrfLogoContainer = styled.div`
  text-align: center;
  margin: auto;
  margin-top: 5rem;

  @media ${device.mobileS} {
    width: 100px;
  }

  @media ${device.laptop} {
    width: 200px;
  }
`;
const StyledbrfLogo = styled.img`
  width: 100%;
  height: auto;
`;

export const ApplyForAidFunds = (): JSX.Element => {

    return (
      <div className="ApplyForAidFunds">
          <StyledbrfLogoContainer>
          <StyledbrfLogo src={brfLogo}></StyledbrfLogo>
          Site under construction. Check back soon for updates.
          </StyledbrfLogoContainer>
      </div>
    );
  };