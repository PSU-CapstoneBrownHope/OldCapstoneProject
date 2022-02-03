import styled from "styled-components";
import {withStyles, createStyles, makeStyles, Theme} from "@material-ui/core/styles"
import Button from "@material-ui/core/Button";
import {Navbar} from "../Index";
import { Footer } from "../Bottom";

const StyledApplyContainer = styled.div`
  width: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

const StyledButton = withStyles((theme: Theme) => ({
  root: {
    height: 70,
    width: 500,
    margin: 10,
    backgroundColor: "#ffffff",
    borderRadius: 1,
    '&:hover': {
      backgroundColor: "#E7E7E7",
    },
    [theme.breakpoints.down('sm')]: {
      height: 60,
      width: 300,
    },
  },
}))(Button);


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: "#ffffff"
    },
    homeButton: {
      marginRight: theme.spacing(2),
      '&:hover' : {
        backgroundColor: "#E7E7E7",
      }
    },
    title: {
      flexGrow: 1,
      textAlign: 'center',
      paddingRight: '2%'
    },
    div: {
      paddingTop: '150px'
    }
  }),
);

export const ApplyForAid = (): JSX.Element => {
  const classes = useStyles();
  return (
    <div>
      <Navbar name="Apply for Aid"></Navbar>
      <div className={classes.div}>
        <StyledApplyContainer>
          <StyledButton variant="contained" size="large" href="/apply-for-aid/services">Services</StyledButton>
          <StyledButton variant="contained" size="large" href="/apply-for-aid/goods">Goods</StyledButton>
          <StyledButton variant="contained" size="large" href="/apply-for-aid/funds">Funds</StyledButton>
        </StyledApplyContainer>
      </div>
      <Footer></Footer>
    </div>
  );
};