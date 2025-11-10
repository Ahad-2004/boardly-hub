import { describe, it, expect } from 'vitest';
import { capitalize, truncate } from './stringUtils';

describe('stringUtils', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should return an empty string for empty input', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize(null as unknown as string)).toBe('');
      expect(capitalize(undefined as unknown as string)).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate strings longer than maxLength', () => {
      expect(truncate('This is a long string', 10)).toBe('This is a ...');
      expect(truncate('Hello world', 5)).toBe('Hello...');
    });

    it('should not truncate strings shorter than maxLength', () => {
      expect(truncate('Short', 10)).toBe('Short');
      expect(truncate('', 5)).toBe('');
    });

    it('should handle edge cases', () => {
      expect(truncate('Test', 4)).toBe('Test');
      expect(truncate('Test', 0)).toBe('...');
      expect(truncate('', 0)).toBe('');
      expect(truncate(null as unknown as string, 5)).toBe('');
    });
  });
});
