import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ApplyForAidGoods } from "./ApplyForAidGoods";

// TODO: add tests for requests when routes are established on backend

test("loads and sees Bike checkbox", async () => {
  render(
    <Router>
      <ApplyForAidGoods></ApplyForAidGoods>
    </Router>
  );
  expect(screen.getByText(/Bike/)).toBeInTheDocument();
});

test("loads and sees disabled submit button", async () => {
    render(
      <Router>
        <ApplyForAidGoods></ApplyForAidGoods>
      </Router>
    );
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeDisabled();
});

test("loads and enables submit button after a checkbox is clicked", async () => {
    render(
      <Router>
        <ApplyForAidGoods></ApplyForAidGoods>
      </Router>
    );
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeDisabled();
    const bikeBox = screen.getByRole("checkbox", {name: "Bike"});
    fireEvent.click(bikeBox);
    expect(bikeBox).toBeTruthy();
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
});

