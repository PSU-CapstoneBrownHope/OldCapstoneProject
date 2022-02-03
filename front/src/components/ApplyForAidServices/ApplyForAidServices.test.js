import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ApplyForAidServices } from "./ApplyForAidServices";

// TODO: add tests for requests when routes are established on backend

test("loads and sees Other checkbox", async () => {
  render(
    <Router>
      <ApplyForAidServices></ApplyForAidServices>
    </Router>
  );
  expect(screen.getByText(/Other/)).toBeInTheDocument();
});

test("loads and sees disabled submit button", async () => {
    render(
      <Router>
        <ApplyForAidServices></ApplyForAidServices>
      </Router>
    );
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeDisabled();
});

test("loads and enables submit button after a checkbox is clicked", async () => {
    render(
      <Router>
        <ApplyForAidServices></ApplyForAidServices>
      </Router>
    );
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeDisabled();
    const otherBox = screen.getByRole("checkbox", {name: "Other"});
    fireEvent.click(otherBox);
    expect(otherBox).toBeTruthy();
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
});

