import { useState } from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import {
  withStyles,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { green } from "@material-ui/core/colors";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { device } from "../../styles/devices";
import { Navbar } from "../Index";
import { routes } from "../../util/config";
import { useHistory } from 'react-router';

const StyledLabel = styled(Form.Label)`
  color: white;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  @media ${device.mobileS} {
    font-size: 14px;
  }

  @media ${device.laptop} {
    font-size: 16px;
  }
`;

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

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
    payment: {
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      paddingBottom: "10px",
      [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "16px",
      },
    },
  })
);

const paymentMethods = ["Check", "CashApp", "PayPal", "Other"];

export const ApplyForFunds = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const [reasonForFunds, setReasonForFunds] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentContext, setPaymentContext] = useState("");
  const [surveyCheck, setSurveyCheck] = useState({
    surveyCheck: true,
  });

  const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSurveyCheck({
      ...surveyCheck,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPaymentMethod(event.target.value as string);
  };

  function postFundingRequest() {
    let reasonText = reasonForFunds;
    if (!reasonText) {
      reasonText = "User has requested aid";
    }
    const request = {
      fundingRequest: reasonText,
      paymentMethod: paymentMethod,
      paymentContext: paymentContext,
      survey: surveyCheck.surveyCheck,
    };

    console.log(request);

    const requestAsync = async () => {
      try {
        const sessionUser = sessionStorage.getItem('username')
        if (sessionUser != null) {
          history.push("/apply-for-aid");
          const resp = await axios.post(routes.applyForFunds, request, { withCredentials: true });
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
        alert("Request failed")
        console.error(err);
      }
    };
    requestAsync();
  }

  const MenuItems = paymentMethods.map((i) => (
    <MenuItem data-testid="select-option" className={classes.input} value={i}>
      {i}
    </MenuItem>
  ));
  return (
    <div>
      <Navbar name="Apply For Funds"></Navbar>
      <Row>
        <Col span={8} xs={6} sm={8}></Col>
        <Col span={8} xs={12} sm={8}>
          <Form>
            <Form.Group controlId="request">
              <StyledLabel>
                What will you use the funds for? (optional)
              </StyledLabel>
              <Form.Control
                as="textarea"
                rows={3}
                value={reasonForFunds}
                onChange={(e) => setReasonForFunds(e.target.value)}
                className={classes.input}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col span={8} xs={6} sm={8}></Col>
      </Row>
      <Row>
        <Col span={8} xs={6} sm={8}></Col>
        <Col span={8} xs={12} sm={8}>
          <FormControl className={classes.payment}>
            <InputLabel id="demo-simple-select-helper-label">
              Payment Method
            </InputLabel>
            <Select
              name="paymentMethodSelect"
              data-testid="select"
              value={paymentMethod}
              onChange={handleChangeSelect}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {MenuItems}
            </Select>
            <FormHelperText>Select your payment method</FormHelperText>
          </FormControl>
        </Col>
        <Col span={8} xs={6} sm={8}></Col>
      </Row>
      <Row>
        <Col span={8} xs={6} sm={8}></Col>
        <Col span={8} xs={12} sm={8}>
          <Form>
            <Form.Group controlId="paymentMethod">
              <StyledLabel>
                Give us additional context (e.g. The username of your payment
                account)
              </StyledLabel>
              <Form.Control
                as="textarea"
                rows={3}
                value={paymentContext}
                onChange={(e) => setPaymentContext(e.target.value)}
                className={classes.input}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col span={8} xs={6} sm={8}></Col>
      </Row>

      <Row>
        <Col span={8} xs={6} sm={8}></Col>
        <Col span={8} xs={12} sm={8}>
          <FormControlLabel
            control={
              <GreenCheckbox
                checked={surveyCheck.surveyCheck}
                onChange={handleChangeCheckBox}
                name="surveyCheck"
              />
            }
            classes={{ label: classes.label }}
            label="Would you be willing to share a quote or testimonial about your experience with BRF?"
          />
        </Col>
        <Col span={8} xs={6} sm={8}></Col>
      </Row>
      <Row>
        <Col span={8} xs={6} sm={8}></Col>
        <Col span={8} xs={12} sm={8}>
          <Button
            className={classes.button}
            variant="success"
            onClick={postFundingRequest}
          >
            Submit
          </Button>
        </Col>
        <Col span={8} xs={6} sm={8}></Col>
      </Row>
    </div>
  );
};
