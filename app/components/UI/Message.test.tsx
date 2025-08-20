// app/your-path-to/message.test.ts
import { message } from './Message';
import { message as antdMessage } from 'antd';

// Mock the entire 'antd' module to isolate the test
jest.mock('antd', () => ({
  message: {
    success: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('message utility', () => {
  it('should re-export the message methods correctly', () => {
    const content = 'Test message';
    const duration = 3;
    message.success(content, duration);

    expect(antdMessage.success).toHaveBeenCalledTimes(1);
    expect(antdMessage.success).toHaveBeenCalledWith(content, duration);
  });
});