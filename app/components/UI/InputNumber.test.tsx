// app/components/UI/InputNumber.test.tsx
import React from 'react';
import { render, screen,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputNumber from './InputNumber';

describe('InputNumber', () => {
  it('renders the InputNumber component', () => {
    render(<InputNumber />);
    // The Ant Design InputNumber component renders an input field with a role of 'spinbutton'
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('passes props like min, max, and placeholder correctly', () => {
    const min = 1;
    const max = 10;
    const placeholder = 'Enter a number';

    render(<InputNumber min={min} max={max} placeholder={placeholder} />);

    const inputElement = screen.getByRole('spinbutton');
    
    expect(inputElement).toHaveAttribute('placeholder', placeholder);
    expect(inputElement).toHaveAttribute('aria-valuemin', min.toString());
    expect(inputElement).toHaveAttribute('aria-valuemax', max.toString());
  });

  it('calls onChange handler when the value is changed', () => {
    const mockOnChange = jest.fn();
    render(<InputNumber onChange={mockOnChange} />);
    
    const inputElement = screen.getByRole('spinbutton');
    
    fireEvent.change(inputElement, { target: { value: '5' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(5);
  });

  it('forwards the ref to the underlying AntInputNumber component', () => {
    // Create a ref object
    const ref = React.createRef<any>();
    
    // Render the component and pass the ref
    render(<InputNumber ref={ref} />);
    
    // Check that the ref was successfully attached
    expect(ref.current).not.toBeNull();
    
    // A more advanced test: check for a common method like 'focus' on the ref
    // and verify that the corresponding element has focus.
    const inputElement = screen.getByRole('spinbutton');
    if (ref.current && ref.current.focus) {
      ref.current.focus();
      expect(inputElement).toHaveFocus();
    }
  });
});