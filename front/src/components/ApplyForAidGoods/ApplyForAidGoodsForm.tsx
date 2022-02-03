import React, {SyntheticEvent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {FormHelperText} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
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
      '&.Mui-focused': { // Get rid of focus color on "Item Requests" label
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

export const ApplyForAidGoodsForm = (): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    clothes: false,
    furniture: false, 
    babyItems: false,  
    bike: false, 
    computer: false, 
    householdItems: false, 
    mattressBed: false,  
    food: false, 
    other:false,
    repeatFood: false
  });

  const [clothesNote, setClothesNote] = React.useState("");
  const [furnitureNote, setFurnitureNote] = React.useState("");
  const [babyItemsNote, setBabyItemsNote] = React.useState("");
  const [bikeNote, setBikeNote] = React.useState("");
  const [computerNote, setComputerNote] = React.useState("");
  const [householdItemsNote, setHouseholdItemsNote] = React.useState("");
  const [mattressBedNote, setMattressBedNote] = React.useState("");
  const [otherNote, setOtherNote] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });  }



  const { 
    clothes, 
    furniture, 
    babyItems,  
    bike, 
    computer, 
    householdItems, 
    mattressBed, 
    food, 
    other, 
    repeatFood, 
  } = state;
  
  function validateForm() {
    return clothes || furniture || babyItems || bike || computer || householdItems || mattressBed || food || other || repeatFood;
  }

  function handleGoodsApplicationSubmit(event: SyntheticEvent) {
    const newGoodsApplicationRequest = {
      state,
      clothesNote,
      furnitureNote, 
      babyItemsNote,
      bikeNote, 
      computerNote,
      householdItemsNote, 
      mattressBedNote, 
      otherNote,  
    };
    

    const sendGoodsApplicationRequest = async () => {
      try {
        const sessionUser = sessionStorage.getItem('username')
        if (sessionUser != null) {
          history.push("/apply-for-aid");
          const resp = await axios.post(routes.applyForAidGoods, newGoodsApplicationRequest, { withCredentials: true });
          if (resp.data === "Success") {
            alert("Application submit successful.")
          } else{
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
    sendGoodsApplicationRequest();
  }

  return (
    <div>
      <FormControl component="fieldset" classes={{root: classes.root}}>
        <FormLabel component="legend" classes={{root: classes.formLabels}}>Item Requests</FormLabel>
        <FormHelperText classes={{root: classes.secondaryHeadings}}>Choose all that apply. After checking a box, if needed, add notes for the requested goods below its checkbox (e.g., "requesting childrens clothes").</FormHelperText>
        <FormGroup>

          <FormControlLabel
            control={<Checkbox checked={clothes} onChange={handleChange} name="clothes" />}
            label="Clothes" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!clothes} 
            value={clothesNote} 
            onChange ={(e) =>setClothesNote(e.target.value)}
            variant="outlined"
          />

          <FormControlLabel
            control={<Checkbox checked={furniture} onChange={handleChange} name="furniture" />}
            label="Furniture" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!furniture} 
            value={furnitureNote} 
            onChange ={(e) =>setFurnitureNote(e.target.value)}
            variant="outlined"
          />
                   
          <FormControlLabel
            control={<Checkbox checked={babyItems} onChange={handleChange} name="babyItems" />}
            label="Baby Items" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!babyItems} 
            value={babyItemsNote} 
            onChange ={(e) =>setBabyItemsNote(e.target.value)}
            variant="outlined"
          />

          <FormControlLabel
            control={<Checkbox checked={bike} onChange={handleChange} name="bike" />}
            label="Bike" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!bike} 
            value={bikeNote} 
            onChange ={(e) =>setBikeNote(e.target.value)}
            variant="outlined"
          />

          <FormControlLabel
            control={<Checkbox checked={computer} onChange={handleChange} name="computer" />}
            label="Computer" classes={{label: classes.labelHeadings}}
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
            control={<Checkbox checked={householdItems} onChange={handleChange} name="householdItems" />}
            label="Household Items" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!householdItems} 
            value={householdItemsNote} 
            onChange ={(e) =>setHouseholdItemsNote(e.target.value)}            
            variant="outlined"
          />
           
          <FormControlLabel
            control={<Checkbox checked={mattressBed} onChange={handleChange} name="mattressBed" />}
            label="Mattress/Bed" classes={{label: classes.labelHeadings}}
          />
          <TextField
            id="outlined-multiline-flexible"        
            multiline
            disabled={!mattressBed} 
            value={mattressBedNote} 
            onChange ={(e) =>setMattressBedNote(e.target.value)}            
            variant="outlined"
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

          <FormHelperText classes={{root: classes.helper}}> Does your household need a food box? Boxes are usually filled with 25-30 lbs. of shelf stable “pantry items.” </FormHelperText>

          <FormControlLabel
            control={<Checkbox checked={food} 
            onChange={handleChange}
            disabled={repeatFood}
            name="food"/>}
            label="Foodbox (one-time)" 
            classes={{label: classes.labelHeadings}}     
          />

          <FormControlLabel
            control={<Checkbox checked={repeatFood} 
            onChange={handleChange}
            disabled={food}
            name="repeatFood"/>}
            label="Foodbox (ongoing)" 
            classes={{label: classes.labelHeadings}}     
          />

          {/*  Food Allergies Input box for Zach
          <Input placeholder="Food allergies or dietary preferences?" inputProps={{ 'aria-label': 'description' }} />
          */}

        </FormGroup>
        <StyledApplicationSubmitButton
              type="button"
              disabled={!validateForm()}
              onClick={handleGoodsApplicationSubmit}
            >
              Submit
        </StyledApplicationSubmitButton>        
      </FormControl>
    </div>
  );
}