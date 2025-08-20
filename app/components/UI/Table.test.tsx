// app/components/UI/CustomTable.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Table from './Table';
import { Table as AntTable } from 'antd';

// Mock the window.matchMedia function which is used by Ant Design components for responsiveness.
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

// Create a mock for the Ant Design Table component.
// The mock is now defined directly inside the jest.mock factory function
// to avoid the "out-of-scope variable" error.
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  const AntTableMock = jest.fn((props) => {
    // Return a simple div to represent the mocked table.
    return <div data-testid="mock-ant-table" />;
  });
  return {
    ...antd,
    Table: AntTableMock,
  };
});

describe('Table', () => {
  // We need to import the mock from the mocked module to inspect its calls.
  const { Table: AntTableMock } = require('antd');
  
  beforeEach(() => {
    // Clear all mock calls and instances before each test.
    jest.clearAllMocks();
  });

  const mockDataSource = [
    { key: '1', name: 'John', age: 32 },
    { key: '2', name: 'Jane', age: 42 },
  ];

  const mockColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
  ];

  it('should render correctly and pass props to AntTable', () => {
    // Render the wrapper component with some props.
    render(<Table dataSource={mockDataSource} columns={mockColumns} />);
    
    // Check that our mock component was called.
    expect(AntTableMock).toHaveBeenCalledTimes(1);

    // Verify that the props are correctly forwarded by checking the mock's calls.
    const props = AntTableMock.mock.calls[0][0]; // Get the first argument from the first call
    expect(props.dataSource).toEqual(mockDataSource);
    expect(props.columns).toEqual(mockColumns);
  });

  it('should forward additional props correctly', () => {
    render(<Table rowKey="id" size="small" />);
    
    // Get the mock component and verify the props.
    expect(AntTableMock).toHaveBeenCalledTimes(1);

    const props = AntTableMock.mock.calls[0][0];
    expect(props.rowKey).toEqual('id');
    expect(props.size).toEqual('small');
  });
});
