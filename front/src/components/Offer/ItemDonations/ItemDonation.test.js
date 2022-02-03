import { ItemDonations } from "./ItemDonations";
import { render, screen, fireEvent  } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import { Items } from "./ItemDonationConfig";

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
      <ItemDonations></ItemDonations>
    </Router>
  );
  expect(screen.getByText(/Submit/)).toBeInTheDocument();
});

describe("enter in text in textareas", () => {
  test("test for additional info", async () => {
    render(
      <Router>
        <ItemDonations></ItemDonations>
      </Router>
    );

    let labelText =
      "Please provide additonal information (e.g. Address of the location)";
    const reason = screen.getByLabelText(labelText);
    fireEvent.change(reason, { target: { value: "foo" } });
    expect(reason.value).toBe("foo");
  });
  test("test for contact info", async () => {
    render(
      <Router>
        <ItemDonations></ItemDonations>
      </Router>
    );

    let labelText = "Please provide contact information";
    const reason = screen.getByLabelText(labelText);
    fireEvent.change(reason, { target: { value: "foo" } });
    expect(reason.value).toBe("foo");
  });
});

test("checkboxes work", async () => {
    const mockOnClick = jest.fn()
  const { getByTestId } = render(
    <Router>
      <ItemDonations></ItemDonations>
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
