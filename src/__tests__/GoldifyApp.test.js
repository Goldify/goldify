import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoldifyApp from '../js/GoldifyApp';

test('renders learn react link', () => {
  render(<GoldifyApp />);
  const linkElement = screen.getByText(/Goldify/i);
  expect(linkElement).toBeInTheDocument();
});
