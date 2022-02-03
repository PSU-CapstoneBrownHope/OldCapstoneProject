import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Row, Col } from "antd";
import { Form, Button } from "react-bootstrap";
import { Context, Items } from "./ServiceDonationsConfig";
import { device } from "../../../styles/devices";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { routes } from "../../../util/config";
import { Navbar } from "../../Navbar";
import { useHistory } from 'react-router';

const StyledLabel = styled(Form.Label)`
  color: white;
  @media ${device.mobileS} {
    font-size: 14px;
  }

  @media ${device.laptop} {
    font-size: 16px;
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: "white",
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "16px",
      },
    },
    input: {
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "16px",
      },
    },
    button: {
      marginTop: "10px",
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "16px",
      },
    },
  })
);
interface ILooseObject {
  [key: string]: boolean;
}

export const ServiceDonations = () => {
  const history = useHistory();
  const [itemsObj, setItemsObj] = useState<ILooseObject | undefined>(undefined);
  const [context, setContext] = useState("");
  const [orgContext, setOrgContext] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  useEffect(() => {
    let ItemsObj: any = {};
    if (Items) {
      Items.forEach((i: string) => (ItemsObj[i] = false));
    }
    setItemsObj(ItemsObj);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemsObj({ ...itemsObj, [event.target.name]: event.target.checked });
  };

  function postDonationItems() {
    if (!itemsObj) return false;
    let checkedItems: string[] = [];
    for (const [k, v] of Object.entries(itemsObj)) {
      if (v !== false) checkedItems.push(k);
    }

    let postObj = {
      donationServices: checkedItems,
      additionalInformation: context,
      organization: orgContext,
      contactInformation: contactInfo,
    };

    const sendUpdateRequest = async () => {
      try {
        const sessionUser = sessionStorage.getItem('username')
        if (sessionUser != null) {
          history.push("/offer-aid");
          const resp = await axios.post(routes.offerServices, postObj, { withCredentials: true });
          if (resp.data === "Success") {
            alert("Application submit successful.")
          } else {
            alert("Application submit failed.")
          }
        } else {
          alert("You're not logged in. Redirecting to login page.");
          history.push("/");
        }
      } catch (err) {
        // Handle Error Here
        console.error(err);
      }
    };
    sendUpdateRequest();
  }

  function Checkboxes() {
    if (!Items || !itemsObj || Object.keys(itemsObj).length === 0)
      return <span></span>;

    const Element = Items.map((i) => (
      <>
        <FormControlLabel
          control={
            <Checkbox
              onChange={handleChange}
              data-testid={i}
              name={i}
              checked={itemsObj[i]}
            />
          }
          label={i}
          classes={{ label: classes.label }}
        />
      </>
    ));

    return <FormGroup>{Element}</FormGroup>;
  }

  const classes = useStyles();

  return (
    <div>
      <Navbar name="Service Donations"></Navbar>
      <Row>
        <Col span={8} xs={6} sm={8}></Col>
        <Col span={8} xs={12} sm={8}>
          <StyledLabel>
            <Context></Context>
          </StyledLabel>
        </Col>
        <Col span={8} xs={6} sm={8}></Col>
      </Row>
      <Row>
        <Col span={8} xs={6} sm={8}></Col>
        <Checkboxes></Checkboxes>
        <Col span={8} xs={6} sm={8}></Col>
      </Row>
      <Row>
        <Col span={8} xs={6} sm={8}></Col>
        <Col span={8} xs={12} sm={8}>
          <Form>
            <Form.Group controlId="orgContext">
              <StyledLabel className={classes.label}>
                Are you the owner of, or working with, a business or
                organization that would like to donate items or services?
              </StyledLabel>
              <Form.Control
                as="textarea"
                rows={1}
                value={orgContext}
                onChange={(e) => setOrgContext(e.target.value)}
                className={classes.input}
              />
            </Form.Group>
            <Form.Group controlId="donationContext">
              <StyledLabel className={classes.label}>
                Please provide additonal information (e.g. Address of the
                location)
              </StyledLabel>
              <Form.Control
                as="textarea"
                rows={3}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className={classes.input}
              />
            </Form.Group>
            <Form.Group controlId="contactInfo">
              <StyledLabel className={classes.label}>
                Please provide contact information
              </StyledLabel>
              <Form.Control
                as="textarea"
                rows={3}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className={classes.input}
              />
            </Form.Group>
          </Form>
          <Button
            variant="success"
            className={classes.button}
            onClick={postDonationItems}
          >
            Submit
          </Button>
        </Col>
        <Col span={8} xs={6} sm={8}></Col>
      </Row>
    </div>
  );
};
