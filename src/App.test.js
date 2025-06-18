import { render, screen } from '@testing-library/react';
import App from './App';

test('renders “Películas Populares” text', () => {
  render(<App />);
  const headingElement = screen.getByText(/Películas Populares/i);
  expect(headingElement).toBeInTheDocument();
});
