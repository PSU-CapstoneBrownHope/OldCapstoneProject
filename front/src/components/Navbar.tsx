import React, { useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem"
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {Link, useHistory} from "react-router-dom";
import { routes } from "../util/config";
import axios from 'axios';

// How to input a Navbar with customized title
// <Navbar name="insertTitleHere"></Navbar>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: 96,
    },
    // Icon Styling
    homeButton: {
      marginRight: theme.spacing(8),
      '&:hover' : {
        color: 'white',
      }
    },
    accountButton: {
      '&:hover' : {
        color: 'white',
      }
    },
    // Title styling
    title: {
      flexGrow: 1,
      textAlign: 'center',
      paddingRight: '2%',
    },
    div: {
      paddingTop: '150px'
    },
    // Mobile version Menu Styling
    menu: {
      fontSize: '16px',
    },
    link: {
      color: 'white',
    },
    // Adds space between navbar and content
    spacer: {
      backgroundColor: 'rgb(36, 35, 35)',
      boxShadow: 'none',
      ...theme.mixins.toolbar,
    },
  }),
);

interface Props {
  name: String;
};

export const Navbar = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    mobileView: false,
    drawerOpen: false
  });

  const {mobileView, drawerOpen} = state;
  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({...prevState, mobileView: true}))
        : setState((prevState) => ({...prevState, mobileView: false}))
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  // Grab username from Session Storage
  function getUsername() {
    if (sessionStorage.getItem('username') == null)
      return history.push("/");
    return sessionStorage.getItem('username');
  }

  // Sign user out
  function signOut(){
    sessionStorage.clear();
    const requestSignOut = async () => {
      try {
        const resp = await axios.post(routes.signout);
        console.log(resp)
        history.push("/");
      } catch (err) {
        // Handle Error Here
        console.error(err);
      }
    };
    requestSignOut();
  }
  const displayDesktop = (props : Props) => {

    const handleDrawerOpen = () =>
      setState((prevState) => ({...prevState, drawerOpen: true}));
    const handleDrawerClose = () =>
      setState((prevState) => ({...prevState, drawerOpen: false}));
    
      return (
        <div className={classes.root}>
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" className={classes.homeButton} color="inherit" aria-label="home" href="/landing">
                <HomeIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}> 
                <Box fontWeight="fontWeightBold">
                  {props.name} 
                </Box>
              </Typography>

              {/* Account Button and Menu*/}
              <IconButton className={classes.accountButton} aria-label="current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleDrawerOpen} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu 
                classes={{paper: classes.menu}}
                getContentAnchorEl={null}
                open={Boolean(drawerOpen)}
                onClose={handleDrawerClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  Welcome {getUsername()} {/*Print username from session storage*/}
                </MenuItem>
                <MenuItem onClick={handleDrawerOpen}>
                  <Link to="/" className={classes.link} onClick={signOut}>Sign Out</Link>
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <div className={classes.spacer} /> 
        </div>
      )
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({...prevState, drawerOpen: true}));
    const handleDrawerClose = () =>
      setState((prevState) => ({...prevState, drawerOpen: false}));
    

    return (
      <div>
        <IconButton color="inherit" aria-label="home" onClick={handleDrawerOpen}>
          <MenuIcon />
        </IconButton>
        <Menu
          classes={{paper: classes.menu}}
          getContentAnchorEl={null}
          open={Boolean(drawerOpen)}
          onClose={handleDrawerClose}
        >
            <MenuItem>
              <Link to="/landing" className={classes.link}>Home</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/apply-for-aid" className={classes.link}>Apply For Aid</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/offer-aid" className={classes.link}>Offer Aid</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/" className={classes.link}>View Request</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/account" className={classes.link}>Edit Account</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/" className={classes.link} onClick={signOut}>Sign Out</Link>
            </MenuItem>
        </Menu>
      </div>
    )
  };

  return (
    <AppBar position="static">
      {mobileView ? displayMobile() : displayDesktop(props)}
    </AppBar>
  );
};
