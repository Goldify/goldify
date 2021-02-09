import React from "react";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoldifyApp from "../js/GoldifyApp";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import reportWebVitals from "../js/utils/reportWebVitals";
import { HOME_PAGE_PATH, SOLO_PAGE_PATH } from "../js/utils/constants";

configure({ adapter: new Adapter() });

test("Goldify App has proper footer", () => {
  render(<GoldifyApp />);
  const footerElement = screen.getByText(/Goldify is powered by/i);
  expect(footerElement).toBeInTheDocument();
});

test("Confirm the Selected Tab is correct", () => {
  const wrapper = shallow(<GoldifyApp />);
  expect(wrapper.instance().getSelectedTab(HOME_PAGE_PATH)).toEqual(false);
  expect(wrapper.instance().getSelectedTab(SOLO_PAGE_PATH)).toEqual(0);
});

test("Run Web Vitals", () => {
  reportWebVitals(console.log);

  reportWebVitals((metric) => {
    console.log(metric);
  });
});

test("Load index js script file without error", () => {
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root);
  act(() => {
    require("../index.jsx");
  });
});
