import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { UpdatePassword } from "./UpdatePassword";

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
        <UpdatePassword></UpdatePassword>
      </Router>
    );
    expect(screen.getByText(/Username/)).toBeInTheDocument();
  });

  test("loads and sees the oldpassword text", async () => {
    render(
      <Router>
        <UpdatePassword></UpdatePassword>
      </Router>
    );
    expect(screen.getByText(/Old Password/)).toBeInTheDocument();
  });

  test("loads and sees the new password text", async () => {
    render(
      <Router>
        <UpdatePassword></UpdatePassword>
      </Router>
    );
    expect(screen.getByText(/New Password/)).toBeInTheDocument();
  });

  test("loads and sees the verify new password text", async () => {
    render(
      <Router>
        <UpdatePassword></UpdatePassword>
      </Router>
    );
    expect(screen.getByText(/Verify New Password/)).toBeInTheDocument();
  });

  describe("form field input", () => {
    test("enter username, old password, new password, verify password, and update button", async () => {
      render(
        <Router>
          <UpdatePassword></UpdatePassword>
        </Router>
      );
      const username = screen.getByRole("textbox", { name: "Username" });
      const oldpassword = screen.getByRole("textbox", { name: "Old Password" });
      const newpassword = screen.getByRole("textbox", { name: "New Password" });
      const verifypassword = screen.getByRole("textbox", { name: "Verify New Password" });

      fireEvent.change(username, {
          target: { value: "person" }, 
        });
      expect(username.value).toBe("person");
      fireEvent.change(oldpassword, {
        target: { value: "oldpass" }, 
        });
      expect(oldpassword.value).toBe("oldpass");
      fireEvent.change(newpassword, {
        target: { value: "newpass" }, 
        });
      expect(newpassword.value).toBe("newpass");
      fireEvent.change(verifypassword, {
        target: { value: "newpass" }, 
        });
      expect(verifypassword.value).toBe("newpass");
  
      //get Update button
      const updateButton = screen.getByRole("button", { name: "Update" });
      expect(updateButton).not.toBeDisabled();
    });
});