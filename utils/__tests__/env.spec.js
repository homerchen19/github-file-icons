import env from '../env';

describe('env', () => {
  it('should exist', () => {
    expect(env).toBeDefined();
  });

  it('should return value', () => {
    expect(env.NODE_ENV).toBe('test');
    expect(env.PORT).toBe(3000);
  });
});
