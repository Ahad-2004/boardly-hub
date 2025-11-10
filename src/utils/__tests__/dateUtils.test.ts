import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { formatDate } from '../dateUtils';

describe('dateUtils', () => {
  // Mock the current date to 2023-05-15T12:00:00Z
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-05-15T12:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('should format a date string in the default format', () => {
      const date = '2023-05-15T10:30:00Z';
      expect(formatDate(date)).toBe('May 15, 2023');
    });

    it('should format a date string with a custom format', () => {
      const date = '2023-05-15T10:30:00Z';
      expect(formatDate(date, 'yyyy-MM-dd')).toBe('2023-05-15');
      expect(formatDate(date, 'MM/dd/yyyy')).toBe('05/15/2023');
    });

    it('should handle Date objects', () => {
      const date = new Date('2023-05-15T10:30:00Z');
      expect(formatDate(date)).toBe('May 15, 2023');
    });

    it('should return empty string for invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('');
      expect(formatDate('')).toBe('');
      expect(formatDate(null as unknown as string)).toBe('');
      expect(formatDate(undefined as unknown as string)).toBe('');
    });
  });
});
