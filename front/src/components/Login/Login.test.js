import { render, screen, fireEvent } from "@testing-library/react";
import { Link, BrowserRouter as Router, BrowserRouter } from "react-router-dom";

import { Login } from "./Login";

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

test("loads and sees the username text", async () => {
  render(
    <Router>
      <Login></Login>
    </Router>
  );
  expect(screen.getByText(/Username/)).toBeInTheDocument();
});

describe("sign up button actions", () => {
  test("signup button toggles", async () => {
    render(
      <Router>
        <Login></Login>
      </Router>
    );
    const button = screen.getByRole("button", { name: "Sign Up" });
    fireEvent.click(button);
    expect(screen.getByText(/Confirm Password/)).toBeInTheDocument();

    // untoggle button
    fireEvent.click(button);
    expect(screen.queryByText(/Confirm Password/)).not.toBeInTheDocument();
  });
});

describe("form field input", () => {
  test("enter username and password", async () => {
    render(
      <Router>
        <Login></Login>
      </Router>
    );
    const username = screen.getByRole("textbox", { name: "Username" });
    fireEvent.change(username, { target: { value: "foo" } });
    expect(username.value).toBe("foo");
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "bar" },
    });
    expect(password.value).toBe("bar");

    //get login button
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).not.toBeDisabled();
  });

  test("signup email and password verify password", async () => {
    render(
      <Router>
        <Login></Login>
      </Router>
    );
    const button = screen.getByRole("button", { name: "Sign Up" });
    fireEvent.click(button);
    const email = screen.getByRole("textbox", { name: "Email" });
    fireEvent.change(email, { target: { value: "foo" } });
    expect(email.value).toBe("foo");

    const username = screen.getByRole("textbox", { name: "Username" });
    fireEvent.change(username, { target: { value: "foo" } });
    expect(username.value).toBe("foo"); 

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "bar" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "bar" },
    });
    expect(password.value).toBe("bar");
    expect(confirmPassword.value).toBe("bar");

    //get submit button
    const signUpSubmitButton = screen.getByRole("button", { name: "Submit" });
    expect(signUpSubmitButton).not.toBeDisabled();
  });
});
