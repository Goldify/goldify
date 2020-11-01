import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../js/App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Goldify/i);
  expect(linkElement).toBeInTheDocument();
});
