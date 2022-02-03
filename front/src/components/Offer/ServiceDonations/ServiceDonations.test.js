import { ServiceDonations } from "./ServiceDonations";
import { render, screen, fireEvent,  } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import {  Items } from "./ServiceDonationsConfig";

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
      <ServiceDonations></ServiceDonations>
    </Router>
  );
  expect(screen.getByText(/Submit/)).toBeInTheDocument();
});

describe("enter in text in textareas", () => {
  test("test for additional info", async () => {
    render(
      <Router>
        <ServiceDonations></ServiceDonations>
      </Router>
    );

    let labelText =
      "Please provide additonal information (e.g. Address of the location)";
    const reason = screen.getByLabelText(labelText);
    fireEvent.change(reason, { target: { value: "foo" } });
    expect(reason.value).toBe("foo");
  });
 
});

test("checkboxes work", async () => {
  const { getByTestId } = render(
    <Router>
      <ServiceDonations></ServiceDonations>
    </Router>
  );

  let firstElement = Items[0];
  //   const checkbox = screen.getByLabelText(firstElement)
  //   console.log(checkbox);
  //   fireEvent.click(checkbox);
  //   console.log(checkbox);

  //   expect(checkbox).toBeChecked();

  const checkbox = getByTestId(firstElement).querySelector(
    'input[type="checkbox"]'
  );
  expect(checkbox.checked).toBe(false);

});
