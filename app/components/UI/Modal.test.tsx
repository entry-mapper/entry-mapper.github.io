import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal', () => {
  const mockOnOk = jest.fn();
  const mockOnCancel = jest.fn();

  it('renders the modal when visible', () => {
    render(<Modal open title="Test Modal">Content</Modal>);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(<Modal open={false} title="Test Modal">Content</Modal>);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onOk when OK button is clicked', () => {
    render(<Modal open onOk={mockOnOk}>Content</Modal>);
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(mockOnOk).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(<Modal open onCancel={mockOnCancel}>Content</Modal>);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('applies custom props like footer', () => {
    render(<Modal open footer={null}>No footer</Modal>);
    expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
    expect(screen.getByText('No footer')).toBeInTheDocument();
  });
});