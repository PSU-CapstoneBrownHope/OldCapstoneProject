import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ApplyForAid } from "./ApplyForAid";


test("loads and sees Funds button", async () => {
  render(
    <Router>
      <ApplyForAid></ApplyForAid>
    </Router>
  );
  expect(screen.getByText(/Funds/)).toBeInTheDocument();
});


test("Funds button enabled", async () => {
    render(
        <Router>
            <ApplyForAid></ApplyForAid>
        </Router>
    );
    const fundsButton = screen.getByRole("link", { name: "Funds" });
    expect(fundsButton).not.toBeDisabled();
    fireEvent.click(fundsButton);
});


test("loads and sees Services button", async () => {
    render(
        <Router>
        <ApplyForAid></ApplyForAid>
        </Router>
    );
    expect(screen.getByText(/Services/)).toBeInTheDocument();
});
  
test("Services button enabled", async () => {
    render(
    <Router>
        <ApplyForAid></ApplyForAid>
    </Router>
    );
    const servicesButton = screen.getByRole("link", { name: "Services" });
    expect(servicesButton).not.toBeDisabled();
    fireEvent.click(servicesButton);
    
});

test("loads and sees Goods button", async () => {
    render(
        <Router>
            <ApplyForAid></ApplyForAid>
        </Router>
    );
    expect(screen.getByText(/Goods/)).toBeInTheDocument();
});
  

test("Goods button enabled", async () => {
    render(
        <Router>
            <ApplyForAid></ApplyForAid>
        </Router>
    );
    const servicesButton = screen.getByRole("link", { name: "Services" });
    expect(servicesButton).not.toBeDisabled();
    fireEvent.click(servicesButton);    
});