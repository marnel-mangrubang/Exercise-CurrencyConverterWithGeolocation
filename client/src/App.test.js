import { render, screen } from '@testing-library/react';
import App from './App';

test('renders heading text', async () => {

  render(<App />);
  expect(await screen.findByText("Currency Converter"));

});


