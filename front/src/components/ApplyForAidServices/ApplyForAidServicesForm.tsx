import React, {SyntheticEvent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import {FormHelperText} from '@material-ui/core';
import axios from "axios";
import { useHistory } from 'react-router';
import { routes } from "../../util/config";
import styled from "styled-components";
import {Button } from "react-bootstrap";

// TODO: get routes for airtable requests - submissions are expected to fail till then

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      margin: 'auto',
      width: '400px',
      [theme.breakpoints.down('sm')]: {
        width: '200px',
      },
    },
    formLabels: { // styles applied to Header
      color: 'white',
      fontSize: '20px',
      '&.Mui-focused': { // Get rid of focus color on "Services Requests" label
        color: 'white',
      },
      paddingTop: '50px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
      },
    },
    helper: { // styles applied to Helper / Foodbox note
      color: 'white',
      fontSize: '16px',
      paddingTop: '20px',
      paddingBottom: '20px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
        paddingBottom: '50px',
      },
    },
    labelHeadings: { // styles applied to checkbox labels
      color: 'white',
      fontSize: '16px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px',
      },
    },
    secondaryHeadings: { // styles applied to secondary headings
      color: 'white',
      fontSize: '14px',
      marginTop: '20px',
      marginBottom: '20px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
      },
    },
  }),
);

const StyledApplicationSubmitButton = styled(Button)`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const ApplyForAidServicesForm = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    yardWork: false, 
    carMaintenance: false, 
    therapy: false, 
    junkFurniture: false, 
    computer: false, 
    errands: false,
    resourceID: false, 
    other: false, 
  });

  const [yardWorkNote, setYardWorkNote] = React.useState("");
  const [carMaintenanceNote, setCarMaintenanceNote] = React.useState("");
  const [therapyNote, setTherapyNote] = React.useState("");
  const [junkFurnitureNote, setJunkFurnitureNote] = React.useState("");
  const [computerNote, setComputerNote] = React.useState("");
  const [errandsNote, setErrandsNote] = React.useState("");
  const [resourceIDNote, setResourceIDNote] = React.useState("");
  const [otherNote, setOtherNote] = React.useState("");
  const [serviceTimeNote, setServiceTimeNote] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { yardWork, carMaintenance, therapy, junkFurniture, computer, errands, resourceID, other } = state;
  
  function validateForm() {
    return yardWork || carMaintenance || therapy || junkFurniture || computer || errands || resourceID || other;
  }

  function handleServicesApplicationSubmit(event: SyntheticEvent) {
    const newServicesApplicationRequest = {
      state,
      yardWorkNote, 
      carMaintenanceNote, 
      therapyNote, 
      junkFurnitureNote, 
      computerNote, 
      errandsNote,
      resourceIDNote, 
      otherNote,
      serviceTimeNote,
    };

    const sendServicesApplicationRequest = async () => {
      try {
        const sessionUser = sessionStorage.getItem('username')
        if (sessionUser != null) {
          history.push("/apply-for-aid");
          const resp = await axios.post(routes.applyForAidServices, newServicesApplicationRequest, { withCredentials: true });
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
        alert("Error: application failed");
        // Handle Error Here
        console.error(err);
      }
    };
    sendServicesApplicationRequest();
  }

  return (
    <div>
      <FormControl component="fieldset" classes={{root: classes.root}}>
        <FormLabel component="legend" classes={{root: classes.formLabels}}>Service Requests</FormLabel>
        <FormHelperText classes={{root: classes.secondaryHeadings}}>Choose all that apply. After checking a box, please add more information about the service you need in the textboxes below (e.g., "I need help with pruning and can provide shears.")</FormHelperText>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={yardWork} onChange={handleChange} name="yardWork" />}
            label="Yard work" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!yardWork} 
            value={yardWorkNote} 
            onChange ={(e) =>setYardWorkNote(e.target.value)}
            variant="outlined"
          />
          
          <FormControlLabel
            control={<Checkbox checked={carMaintenance} onChange={handleChange} name="carMaintenance" />}
            label="Car maintenance" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!carMaintenance} 
            value={carMaintenanceNote} 
            onChange ={(e) =>setCarMaintenanceNote(e.target.value)}
            variant="outlined"
          />

          <FormControlLabel
            control={<Checkbox checked={therapy} onChange={handleChange} name="therapy" />}
            label="Therapy" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!therapy} 
            value={therapyNote} 
            onChange ={(e) =>setTherapyNote(e.target.value)} 
            variant="outlined"
          />

          <FormControlLabel
            control={<Checkbox checked={junkFurniture} onChange={handleChange} name="junkFurniture" />}
            label="Junk/Furniture removal" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!junkFurniture} 
            value={junkFurnitureNote} 
            onChange ={(e) =>setJunkFurnitureNote(e.target.value)} 
            variant="outlined"
          />

          <FormControlLabel
            control={<Checkbox checked={computer} onChange={handleChange} name="computer" />}
            label="Computer literacy" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!computer} 
            value={computerNote} 
            onChange ={(e) =>setComputerNote(e.target.value)}
            variant="outlined"
          />

          <FormControlLabel
            control={<Checkbox checked={errands} onChange={handleChange} name="errands" />}
            label="Errands/Transportation" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!errands} 
            value={errandsNote} 
            onChange ={(e) =>setErrandsNote(e.target.value)}
            variant="outlined"
          />

          <FormControlLabel
            control={<Checkbox checked={resourceID} onChange={handleChange} name="resourceID" />}
            label="Resource Identification" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!resourceID} 
            value={resourceIDNote} 
            onChange ={(e) =>setResourceIDNote(e.target.value)}
            variant="outlined"
            InputProps={{className: classes.labelHeadings}}
          />

           <FormControlLabel
            control={<Checkbox checked={other} onChange={handleChange} name="other" />}
            label="Other" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!other} 
            value={otherNote} 
            onChange ={(e) =>setOtherNote(e.target.value)} 
            variant="outlined"
          />

        <FormHelperText classes={{root: classes.secondaryHeadings}}>When can a volunteer fullfill your service request? Please list preferred days times if you need to be home when the work is being done (such as yard work).</FormHelperText>

        <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!validateForm()} 
            value={serviceTimeNote} 
            onChange ={(e) =>setServiceTimeNote(e.target.value)} 
            variant="outlined"
          />

        </FormGroup>
        <StyledApplicationSubmitButton
              type="button"
              disabled={!validateForm()}
              onClick={handleServicesApplicationSubmit}
            >
              Submit
        </StyledApplicationSubmitButton>        
      </FormControl>
    </div>
  );
}