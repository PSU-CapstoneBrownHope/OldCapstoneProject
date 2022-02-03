import { ApplyForFunds } from "./ApplyForFunds";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

test("loads and sees submit button", async () => {
  render(
    <Router>
      <ApplyForFunds></ApplyForFunds>
    </Router>
  );
  expect(screen.getByText(/Submit/)).toBeInTheDocument();
});

test("enter textarea", async () => {
  render(
    <Router>
      <ApplyForFunds></ApplyForFunds>
    </Router>
  );
  const reason = screen.getByLabelText(
    "What will you use the funds for? (optional)"
  );
  fireEvent.change(reason, { target: { value: "foo" } });
  expect(reason.value).toBe("foo");
});

test("Simulates selection", () => {
  const { getByTestId, getAllByTestId } = render(
    <Router>
      <ApplyForFunds></ApplyForFunds>
    </Router>
  );
  //The value should be the key of the option
  const select = getByTestId("select");
  fireEvent.mouseDown(select);
  

  //...
});
