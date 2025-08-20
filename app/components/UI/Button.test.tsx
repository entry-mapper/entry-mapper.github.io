import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button', () => {
  it('renders the button with content', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when the button is clicked', () => {
    const mockOnClick = jest.fn();
    render(<Button onClick={mockOnClick}>Click Me</Button>);
    
    // Use getByRole('button') to target the button element specifically
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

    it('applies custom props like type and className', () => {
    render(<Button type="primary" className="custom-class">Submit</Button>);
    
    // Find the button element by its role and accessible name ("Submit")
    const buttonElement = screen.getByRole('button', { name: 'Submit' });
    // Now, assert that the button element itself has the class
    expect(buttonElement).toHaveClass('custom-class');
  });

  it('is disabled when the disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    // Use getByRole('button', { name: ... }) to get the button element
    const buttonElement = screen.getByRole('button', { name: 'Disabled Button' });
    
    // Now you can assert that the button element itself is disabled
    expect(buttonElement).toBeDisabled();
  });
});