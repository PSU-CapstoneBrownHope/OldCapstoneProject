//import {
  //render,
  //screen,
  //fireEvent,
  //queryByAttribute,
//} from "@testing-library/react";
//import { Link, BrowserRouter as Router, BrowserRouter } from "react-router-dom";
//import { AccountInfo } from "./AccountInfo";

//window.matchMedia =
  //window.matchMedia ||
  //function () {
    //return {
      //matches: false,
      //addListener: function () {},
      //removeListener: function () {},
    //};
  //};

//test("loads and sees the email text", async () => {
  //render(
    //<BrowserRouter>
      //<AccountInfo></AccountInfo>
    //</BrowserRouter>
  //);
  //expect(screen.getByText(/Email/)).toBeInTheDocument();
//});

//describe("edit form", () => {
  //test("toggle button for editing", async () => {
     //render(
      //<BrowserRouter>
        //<AccountInfo></AccountInfo>
      //</BrowserRouter>
    //);

    //const button = screen.getByRole("button", { name: "Edit" });
    //fireEvent.click(button);

    //// const userNameInput = document.getElementById("userName");
    //// expect(userNameInput).not.toBeDisabled();
    //// fireEvent.change(userNameInput, { target: { value: 'bar' } })
    //// expect(userNameInput.value).toBe("bar");

    //const userName = screen.getByLabelText('User Name', { selector: 'input' })
    //expect(userName).not.toBeDisabled();

  //});
//});
