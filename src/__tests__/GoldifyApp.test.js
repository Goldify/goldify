import React from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import GoldifyApp from '../js/GoldifyApp';
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import reportWebVitals from '../utils/reportWebVitals';

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

  const viewProfile = screen.getByText(/View Profile/i);
  expect(homeBody).not.toBeInTheDocument();
  expect(viewProfile).toBeInTheDocument();
});

test("Confirm test items exist on the page", () => {
  render(<GoldifyApp />);
  const leftClick = { button: 0 }
  const getStartedButton = screen.getByText("Get Started").closest("a");
  userEvent.click(getStartedButton, leftClick);

  const viewProfile = screen.getByText(/View Profile/i);
  const userId = screen.getByText(goldifyTestUtils.testUserId);
  const userDisplayName = screen.getByText(goldifyTestUtils.testUserDisplayName);
  const userEmail = screen.getByText(goldifyTestUtils.testUserEmail);
  const userFollowersTotal = screen.getByText(String(goldifyTestUtils.testUserFollowersTotal));
  const userCountry = screen.getByText(goldifyTestUtils.testUserCountry);

  expect(viewProfile).toBeInTheDocument();
  expect(userId).toBeInTheDocument();
  expect(userDisplayName).toBeInTheDocument();
  expect(userEmail).toBeInTheDocument();
  expect(userFollowersTotal).toBeInTheDocument();
  expect(userCountry).toBeInTheDocument();
});

const goldifyTestUtils = require("../utils/GoldifyTestUtils");
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