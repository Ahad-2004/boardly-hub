import { describe, it, expect } from 'vitest';

describe('Basic Test', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should test our utility function', () => {
    function multiply(a: number, b: number): number {
      return a * b;
    }
    
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(0, 5)).toBe(0);
    expect(multiply(-1, 1)).toBe(-1);
  });
});
