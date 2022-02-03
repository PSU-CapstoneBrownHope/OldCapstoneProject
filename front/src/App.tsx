import React from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "./styles/theme";
import { ThemeProvider as TP, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./components/Login/Login";
import { AccountInfo } from "./components/Account/AccountInfo/AccountInfo";
import { ApplyForAid } from "./components/ApplyForAid/ApplyForAid";
import { ApplyForAidGoods } from "./components/ApplyForAidGoods/ApplyForAidGoods";
import { ApplyForFunds } from "./components/ApplyForFunds/ApplyForFunds";
import { Landing } from "./components/Landing/Landing";
import { OfferAid } from "./components/Offer/OfferAid";
import { ItemDonations } from "./components/Offer/ItemDonations/ItemDonations";
import { ServiceDonations } from "./components/Offer/ServiceDonations/ServiceDonations";
import { ApplyForAidFunds } from "./components/ApplyForAidFunds/ApplyForAidFunds";
import { ApplyForAidServices } from "./components/ApplyForAidServices/ApplyForAidServices";
import { UpdatePassword } from "./components/UpdatePassword/UpdatePassword";
import { ResetPassword } from "./components/ResetPassword/ResetPassword";
import { VerifyUser } from "./components/ResetPassword/VerifyUser";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import { SignupVerify } from "./components/SignupVerify/SignupVerify";

// This theme is for material UI components like the navbar
const muTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#50dc64",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#11cb5f",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

const Home = () => {
  return (
    <React.StrictMode>
      <Login></Login>
    </React.StrictMode>
  );
};

function App() {
  return (
    <TP theme={muTheme}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/account" component={AccountInfo}></Route>
            <Route exact path="/updatePassword" component={UpdatePassword}></Route>
            <Route exact path="/reset/verify-user" component={VerifyUser}></Route>
            <Route exact path="/reset/:token" component={ResetPassword}></Route>
            <Route exact path="/signup/verify/:token" component={SignupVerify}></Route>
            <Route exact path="/landing" component={Landing}></Route>
            <Route exact path="/apply-for-aid" component={ApplyForAid}></Route>
            <Route
              exact
              path="/apply-for-aid/goods"
              component={ApplyForAidGoods}
            ></Route>
            <Route
              exact
              path="/apply-for-aid/services"
              component={ApplyForAidServices}
            ></Route>
            <Route
              exact
              path="/apply-for-aid/funds"
              component={ApplyForFunds}
            ></Route>
            <Route
              exact
              path="/offer-aid"
              component={OfferAid}
            ></Route>
            <Route
              exact
              path="/offer-aid/item-donations"
              component={ItemDonations}
            ></Route>
            <Route
              exact
              path="/offer-aid/service-donations"
              component={ServiceDonations}
            ></Route>
            <Route
              exact
              path="/updatePassword"
              component={UpdatePassword}
            ></Route>
            <Route exact path="/apply-for-aid" component={ApplyForAid}></Route>
            <Route
              exact
              path="/apply-for-aid/goods"
              component={ApplyForAidGoods}
            ></Route>
            <Route
              exact
              path="/apply-for-aid/services"
              component={ApplyForAidServices}
            ></Route>
            <Route
              exact
              path="/apply-for-aid/funds"
              component={ApplyForAidFunds}
            ></Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </TP>
  );
}

export default App;
