import { Navbar } from "../Index";
import { Footer } from "../Bottom";
import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles"
import IconButton from '@material-ui/core/IconButton'
import AssignmentIcon from '@material-ui/icons/Assignment';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// import { device } from "../../styles/devices";



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      fontSize: '200%',
      width: '100%',
    },
    label: {
      display: 'flex',
      flexDirection:'column',
      [theme.breakpoints.down('sm')]: {
        fontSize: 18,
      },
    },
    gridItem: {

    },
    container: {
      paddingTop: '5%',
      height: '10%',
      width: '500px',
      margin: 'auto',
      [theme.breakpoints.down('sm')]: {
        height: 60,
        width: 300,
      },
    }
  }),
);

export const Landing = (): JSX.Element => {
  const classes = useStyles();
  return (
    <div>
      <Navbar name="Home"></Navbar>
      <Grid container justify="center" alignItems="center" spacing={4} className={classes.container}> 
          <Grid item sm={6} xs={12} className={classes.gridItem}>
            <IconButton href="/apply-for-aid" classes={{label: classes.label}}>
              <AssignmentIcon className={classes.icon}/>
                Apply For Aid
            </IconButton>
          </Grid>
          <Grid item sm={6} xs={12} className={classes.gridItem}>
            <IconButton href="/offer-aid" classes={{label: classes.label}}>
              <LocalShippingIcon className={classes.icon}/>
                Offer Aid
            </IconButton>
          </Grid>
          <Grid item sm={6} xs={12} className={classes.gridItem}>
            <IconButton href="/apply-for-aid" classes={{label: classes.label}}>
              <AssignmentTurnedInIcon className={classes.icon}/>
                View Requests
            </IconButton>
          </Grid>
          <Grid item sm={6} xs={12} className={classes.gridItem}>
            <IconButton href="/account" classes={{label: classes.label}}>
              <AccountCircleIcon className={classes.icon}/>
                Edit Account
            </IconButton>
          </Grid>
        </Grid>
        <Footer></Footer>
    </div>
    
  );
};
