import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import GoldifyApp from '../js/GoldifyApp';
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import reportWebVitals from '../js/utils/reportWebVitals';

configure({adapter: new Adapter()});

test("Goldify Header exists on main app", () => {
  render(<GoldifyApp />);
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});

test("Content changes on click of Get Started", () => {
  render(<GoldifyApp />);
  const homeBody = screen.getByText(/Welcome to Goldify!/i);
  expect(homeBody).toBeInTheDocument();

  const leftClick = { button: 0 }
  const getStartedButton = screen.getByText("Get Started").closest("a");
  const homeButton = screen.getByText("Home").closest("a");
  expect(getStartedButton).toHaveAttribute("href", "/goldify");
  expect(homeButton).toHaveAttribute("href", "/");

  userEvent.click(getStartedButton, leftClick);

  const viewProfile = screen.getByText(/Loading.../i);
  expect(homeBody).not.toBeInTheDocument();
  expect(viewProfile).toBeInTheDocument();
});

test("Run Web Vitals", () => {
  reportWebVitals(console.log);

  reportWebVitals(
    (metric) => {
      console.log(metric);
    }
  );
});

test("Load index js script file without error", () => {
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root);
  require("../index.js");
});