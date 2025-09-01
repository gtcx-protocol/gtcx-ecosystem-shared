// Simple test to verify Jest setup for TradeDesk  
describe('TradeDesk Jest Setup', () => {
  test('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should work with Jest framework', () => {
    expect(typeof jest).toBe('object');
    expect(jest.fn).toBeDefined();
  });
});