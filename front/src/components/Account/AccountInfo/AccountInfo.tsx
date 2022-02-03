import React, { useState, ChangeEvent, useEffect } from "react";
import { Row, Col } from "antd";
import axios from 'axios';
import styled from "styled-components";
import { Form, Button } from "react-bootstrap";
import { accountFields } from "./util";
import { Navbar } from "../../Index";
import { device } from "../../../styles/devices";
import { routes } from '../../../util/config';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';


const useStyles = makeStyles({
  root: {
    marginBottom: '10px',
    marginRight: '10px',
  },
  menu: {
    minWidth: 150,
  },
  username: {
    color: 'white',
  }
});

const StyledButton = styled(Button)`
  max-width: 100px;
  margin: auto;
  @media ${device.mobileS} {
    font-size: 14px;
  }

  @media ${device.laptop} {
    font-size: 16px;
  }
`;

const StyledLabel = styled(Form.Label)`
  color: white;
  @media ${device.mobileS} {
    font-size: 14px;
  }

  @media ${device.laptop} {
    font-size: 16px;
  }
`;

export const AccountInfo = () => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(accountFields);
  const [info, setInfo] = useState(accountFields);
  const [contactMethod, setContact] = useState('');
  const [paymentMethod, setPayment] = useState('');
  const [currentId, setCurrentId] = useState("");
  const classes = useStyles();
  const history = useHistory();
  const handleClick = () => history.push("/updatePassword");

  useEffect(() => {
    if (currentId && AccountFieldsInputs) {
      const inputElement = document.getElementById(currentId);
      if (inputElement) inputElement.focus();
    }
  });

  const updateField = (e: React.BaseSyntheticEvent, index: number): void => {
    const elementValue = (e.target as HTMLInputElement).value;
    const elementId = (e.target as HTMLInputElement).id;
    const formCopy: any = [...form];
    formCopy[index].value = elementValue;
    setForm(formCopy);
    setCurrentId(elementId);
    console.log(form)
  };

  const handleContactChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setContact(event.target.value as string)
    const contactMethod = event.target.value as string;
    const formCopy: any = [...form];
    formCopy[6].value = contactMethod;
    setForm(formCopy);
  };

  const handlePaymentChange = (event: React.ChangeEvent<{value: unknown}>) => {
    setPayment(event.target.value as string)
    const paymentMethod = event.target.value as string;
    const formCopy: any = [...form];
    formCopy[7].value = paymentMethod;
    setForm(formCopy);
  };
  
  function getExistingAccountInfo() {
    const newLoginRequest = {
      userName: accountFields[0].value,
    };

    const sendInfoRequest = async () => {
      try {
        const resp = await axios.post(routes.getAccountInfo, newLoginRequest);
        console.log(resp.data);
        if (resp.data === "No such user exists") {
          alert("No such user exists");
        }
        else {
          const formCopy: any = [...form];
          formCopy[1].value = resp.data.firstName;
          formCopy[2].value = resp.data.lastName;
          formCopy[3].value = resp.data.phoneNumber;
          formCopy[4].value = resp.data.address;
          formCopy[5].value = resp.data.emailAddress;
          formCopy[6].value = resp.data.contactMethod;
          formCopy[7].value = resp.data.paymentMethod;
          setContact(resp.data.contactMethod);
          setPayment(resp.data.paymentMethod);
          setInfo(formCopy);
        }
      } catch (err) {
        console.error(err);
      }
    };
    sendInfoRequest();
    
  }

  function postAccountUpdate() {
    const sendUpdateRequest = async () => {
      try {
        const resp = await axios.post(routes.updateAccount, form, { withCredentials: true });
        console.log(resp.data);
      } catch (err) {
        // Handle Error Here
        console.error(err);
      }
    };
    sendUpdateRequest();
    history.push("/account");
    setEditing(false);
  }

  const AccountFieldsInfo = () => {
    if (info[1].value === "") {
      getExistingAccountInfo();
    }
    let items: any = [];
    info.forEach((item: any, index: any) => {
        items.push(
          <Row key={index}>
            <Col span={8} xs={6} md={8}></Col>
            <Col span={8} xs={12} md={8}>
              <Form.Group>
                <StyledLabel htmlFor={item.name}>{item.label}</StyledLabel>
                <Typography variant="h6" className={classes.username}>{item.value}</Typography>
              </Form.Group>
            </Col>
            <Col span={8} xs={6} md={8}></Col>
          </Row>
        )
    });
    return <>{items}</>;
  }


  const AccountFieldsInputs = () => {
    if (!form) return <span></span>;
    // Generates Menu Options for Contact Method & Payment Method
    function createMenuOptions(options: string[]) {
      let menu: any = [];
      options.forEach((item: any, index: any) => {
          menu.push(
            <MenuItem key={item} value={item}>{item}</MenuItem>
          )
      })
      return menu;
    }

    let items: any = [];
    form.forEach((item: any, index: any) => {
      // Contact / Payment Methods are select options not inputs
      if (item.name === 'userName') {
        items.push(
          <Row key={index}>
            <Col span={8} xs={6} md={8}></Col>
            <Col span={8} xs={12} md={8}>
              <Form.Group>
                <StyledLabel htmlFor={item.name}>{item.label}</StyledLabel>
                <Typography variant="h6" className={classes.username}>{item.value}</Typography>
              </Form.Group>
            </Col>
            <Col span={8} xs={6} md={8}></Col>
          </Row>
        )
      }

      else if (item.type === 'select') {
        if (item.name ==='contactMethod') {
          items.push(
            <Row key={index}>
              <Col span={8} xs={6} md={8}></Col>
              <Col span={8} xs={12} md={8}>
                {/* <StyledInput> */}
                <Form.Group>
                  <FormControl>
                  <InputLabel id={item.name}>{item.label}</InputLabel>
                  <Select
                    labelId={item.name}
                    label={item.name}
                    id={item.name}
                    className={classes.menu}
                    value={contactMethod}
                    onChange={handleContactChange}
                  >
                    {createMenuOptions(item.options)}
                  </Select>
                  </FormControl>
                </Form.Group>
                {/* </StyledInput> */}
              </Col>
              <Col span={8} xs={6} md={8}></Col>
            </Row>
          )
        }
        else {
          items.push(
            <Row key={index}>
              <Col span={8} xs={6} md={8}></Col>
              <Col span={8} xs={12} md={8}>
                {/* <StyledInput> */}
                <Form.Group>
                  <FormControl>
                  <InputLabel id={item.name}>{item.label}</InputLabel>
                  <Select
                    label={item.name}
                    id={item.name}
                    name={item.name}
                    className={classes.menu}
                    value={paymentMethod}
                    onChange={handlePaymentChange}
                  >
                    {createMenuOptions(item.options)}
                  </Select>
                  </FormControl>
                </Form.Group>
                {/* </StyledInput> */}
              </Col>
              <Col span={8} xs={6} md={8}></Col>
            </Row>
          )
        }
        
      }

      else {
        items.push(
            <Row key={index}>
              <Col span={8} xs={6} md={8}></Col>
              <Col span={8} xs={12} md={8}>
                {/* <StyledInput> */}
                <Form.Group>
                  <StyledLabel htmlFor={item.name}>{item.label}</StyledLabel>
                  <Form.Control
                    id={item.name}
                    name={item.name}
                    type={item.type}
                    value={form[index].value}
                    pattern={item.pattern ? item.pattern : undefined}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      updateField(e, index);
                    }}
                  ></Form.Control>
                </Form.Group>
                {/* </StyledInput> */}
              </Col>
              <Col span={8} xs={6} md={8}></Col>
            </Row>
        );
      }
    });
    return <>{items}</>;
  };

  return (
    <div>
      <Navbar name="Edit Account"></Navbar>
      {editing ? <AccountFieldsInputs></AccountFieldsInputs> : <AccountFieldsInfo></AccountFieldsInfo> }
      <Row>
      <Col span={8}></Col>
      <Col span={8}>
        <StyledButton
          variant={editing ? "success" : "outline-success"}
          onClick={() => setEditing(!editing)}
          className={classes.root}
        >
          Edit
        </StyledButton>
          <StyledButton
            variant='outline-success'
            onClick={postAccountUpdate} 
            className={classes.root}
          >
            Save
          </StyledButton>
      </Col>
      <Col span={8}></Col>
      </Row>
      <Row>
      <Col span={8}></Col>
          <StyledButton
          variant={"success"}
          onClick={handleClick}
          className={classes.root}
        >
          Update Password
        </StyledButton>
        <Col span={8}></Col>
      </Row>
    </div>
  );
};
