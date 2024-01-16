import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import LoginFormComponent from '../src/pages/Login'; // Adjust the import based on your file structure

// Mocking necessary modules and functions
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

jest.mock('../src/hooks/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

jest.mock('@umijs/max', () => ({
  history: {
    replace: jest.fn(),
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ token: 'test-token' }),
  })
);

describe('LoginFormComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userEvent.setup();
    React.useState.mockImplementation(jest.requireActual('react').useState);
  });

  it('renders the login form', () => {
    render(<LoginFormComponent />);
    // expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    // expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

//   it('allows the user to enter username and password', () => {
//     render(<LoginFormComponent />);
//     userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
//     userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
//     expect(screen.getByPlaceholderText('Username')).toHaveValue('testuser');
//     expect(screen.getByPlaceholderText('Password')).toHaveValue('password123');
//   });

//   it('handles successful login', async () => {
//     render(<LoginFormComponent />);
//     userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
//     userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
//     fireEvent.click(screen.getByText('Submit'));

//     await waitFor(() => {
//       expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.any(Object));
//       expect(screen.getByText('Welcome to Electrify')).toBeInTheDocument();
//     });
//   });

//   it('shows an error message on login failure', async () => {
//     global.fetch.mockImplementationOnce(() =>
//       Promise.resolve({
//         ok: false,
//         json: () => Promise.resolve({ message: 'Unauthorized' }),
//       })
//     );

//     render(<LoginFormComponent />);
//     userEvent.type(screen.getByPlaceholderText('Username'), 'wronguser');
//     userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpass');
//     fireEvent.click(screen.getByText('Submit'));

//     await waitFor(() => {
//       expect(screen.getByText('Login failed: Unauthorized')).toBeInTheDocument();
//     });
//   });

  // Additional tests can be added for other behaviors like the Keplr login, password strength indicator, etc.
});
