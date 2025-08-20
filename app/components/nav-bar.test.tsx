// app/components/UI/NavBar.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NavBar } from './nav-bar';

// Mock the window.matchMedia function which is used by Ant Design's Row component for responsiveness.
// This is necessary because the JSDOM environment used by Jest doesn't have a real implementation.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Mock the Redux hooks from your application.
jest.mock('../redux/hook', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

// Mock the logout action creator.
jest.mock('../redux/authSlice', () => ({
  logout: jest.fn(),
}));

// Mock the Next.js navigation hooks.
const mockPush = jest.fn();
const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname(),
}));

// Import the mocked hooks and action for local use in tests.
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { logout } from '../redux/authSlice';

describe('NavBar', () => {
  // Clear all mocks before each test to ensure a clean state.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the Admin Portal title', () => {
    // We don't care about authentication for this test, so we can mock a non-authenticated state.
    (useAppSelector as jest.Mock).mockReturnValue({ isAuthenticated: false });
    (mockPathname as jest.Mock).mockReturnValue('/home');
    
    render(<NavBar />);

    // Assert that the title is present in the document.
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      // Set the default mock state to authenticated for these tests.
      (useAppSelector as jest.Mock).mockReturnValue({ isAuthenticated: true });
      (useAppDispatch as jest.Mock).mockReturnValue(jest.fn());
    });

    it('should render the Tabs and Logout button', () => {
      (mockPathname as jest.Mock).mockReturnValue('/home');
      render(<NavBar />);
      
      // Assert that the logout button and tabs are present.
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });

    it('should set the active tab based on the current URL', () => {
      // Mock the pathname to simulate being on the '/country-data' page.
      (mockPathname as jest.Mock).mockReturnValue('/country-data');
      render(<NavBar />);

      // Find the text of the tab and then get its closest parent element with the active class.
      const countryDataTab = screen.getByText('Country Data').closest('.ant-tabs-tab');

      // Check if the parent tab element has the active class.
      expect(countryDataTab).toHaveClass('ant-tabs-tab-active');
    });

    it('should navigate to the correct URL when a tab is clicked', () => {
      (mockPathname as jest.Mock).mockReturnValue('/home');
      render(<NavBar />);
      
      // Find and click on a different tab, e.g., 'Metrics'.
      fireEvent.click(screen.getByText('Metrics'));

      // Assert that the useRouter's push method was called with the correct URL.
      expect(mockPush).toHaveBeenCalledWith('/metrics');
    });

    it('should dispatch logout action and redirect to login on button click', () => {
      (mockPathname as jest.Mock).mockReturnValue('/home');
      const mockDispatch = jest.fn();
      (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
      
      render(<NavBar />);

      // Find and click the logout button.
      fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
      
      // Assert that the dispatch function was called with the logout action.
      expect(mockDispatch).toHaveBeenCalledWith(logout());
      
      // Assert that the router pushed to the login page.
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

//   describe('when not authenticated', () => {
//     it('should not render the Tabs and Logout button', () => {
//       // Mock the state to be not authenticated.
//       (useAppSelector as jest.Mock).mockReturnValue({ isAuthenticated: false });
//       (mockPathname as jest.Mock).mockReturnValue('/home');

//       render(<NavBar />);

//       // Use a query that returns null to assert absence.
//       expect(screen.queryByRole('tablist')).toBeInTheDocument();
//       expect(screen.queryByRole('tablist')).toHaveStyle('height: 0px');

//       // The button is conditionally rendered and should not be in the document.
//       expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
//     });
//   });
});
