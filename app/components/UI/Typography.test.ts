
jest.mock('antd', () => ({
  Typography: {
    Title: jest.fn(() => 'MockTitle'),
    Paragraph: jest.fn(() => 'MockParagraph'),
    Text: jest.fn(() => 'MockText'),
    Link: jest.fn(() => 'MockLink'),
  },
}));

// Import the module to test
import { Typography, Title, Paragraph, Text, Link } from './Typography';

describe('Typography exports', () => {
  // Test the Typography export
  test('should export Typography from antd', () => {
    expect(Typography).toBeDefined();
    expect(Typography).toEqual(require('antd').Typography);
  });

  // Test the Title export
  test('should export Title from antd Typography', () => {
    expect(Title).toBeDefined();
    expect(Title).toBe(require('antd').Typography.Title);
    // Optionally test the function call with empty props
    expect(Title({})).toBe('MockTitle');
  });

  // Test the Paragraph export
  test('should export Paragraph from antd Typography', () => {
    expect(Paragraph).toBeDefined();
    expect(Paragraph).toBe(require('antd').Typography.Paragraph);
    // Optionally test the function call with empty props
    expect(Paragraph({})).toBe('MockParagraph');
  });

  // Test the Text export
  test('should export Text from antd Typography', () => {
    expect(Text).toBeDefined();
    expect(Text).toBe(require('antd').Typography.Text);
    // Optionally test the function call with empty props
    expect(Text({})).toBe('MockText');
  });

  // Test the Link export
  test('should export Link from antd Typography', () => {
    expect(Link).toBeDefined();
    expect(Link).toBe(require('antd').Typography.Link);
    // Optionally test the function call with empty props
    expect(Link({})).toBe('MockLink');
  });
});