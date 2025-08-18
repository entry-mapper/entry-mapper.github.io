// app/components/UI/CustomSelect.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomSelect from './CustomSelect';

// A "clean code" test file should be:
// 1. Readable and well-commented.
// 2. Focused on the component's public API, not its internal implementation.
// 3. Robust and not brittle (e.g., handles the way Ant Design renders elements).

describe('CustomSelect', () => {
  // Mock data for the select options to use across tests.
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders the select component with options', () => {
    // Render the component with mock options.
    render(<CustomSelect options={mockOptions} />);

    // Use a semantic query to find the component by its accessible role,
    // which is the most reliable method.
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  it('passes props like placeholder correctly', () => {
    const placeholderText = 'Select an option';
    render(<CustomSelect placeholder={placeholderText} />);
    
    // Ant Design renders the placeholder text inside a <span> element,
    // so we use getByText to find it by its text content instead of a placeholder attribute.
    expect(screen.getByText(placeholderText)).toBeInTheDocument();
  });

  it('calls onChange handler when an option is selected', () => {
    // Create a mock function to track calls.
    const mockOnChange = jest.fn();
    render(<CustomSelect options={mockOptions} onChange={mockOnChange} />);

    // Simulate user interaction: click to open the dropdown.
    fireEvent.mouseDown(screen.getByRole('combobox'));

    // Find the option in the newly rendered dropdown list and click it.
    fireEvent.click(screen.getByText('Option 2'));
    
    // Assert that the mock function was called once with the correct value.
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('option2', { value: 'option2', label: 'Option 2' });
  });

  it('forwards the ref to the underlying AntSelect component', () => {
    // Create a ref object to pass to the component.
    const ref = React.createRef<any>();
    render(<CustomSelect ref={ref} />);
    
    // Check that the ref's current value is not null, meaning it was attached.
    expect(ref.current).not.toBeNull();
    
    // A more advanced test: check for a common method like 'focus' to prove
    // that the ref points to a component instance with expected methods.
    if (ref.current && typeof ref.current.focus === 'function') {
      ref.current.focus();
      // Verify that the element now has focus.
      expect(screen.getByRole('combobox')).toHaveFocus();
    }
  });
});
