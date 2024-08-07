import { Loader } from '../src/Loader';
import { Secret } from '../src/Secret';

describe('Secret.ts', () => {
  const victim = new Secret();

  it('extends the loader class', () => {
    expect(victim).toBeInstanceOf(Loader);
  });

  describe('json', () => {
    it('parses a JSON string', () => {
      (victim as any).load = jest.fn().mockReturnValue('{"key":"value"}');
      const params = { name: 'json' };
      const val = victim.json(params);
      expect(val).toEqual({ key: 'value' });
    });

    it('returns undefined when not required and the value is empty', () => {
      (victim as any).load = jest.fn().mockReturnValue(undefined);
      const params = { name: 'json' };
      const val = victim.json(params);
      expect(val).toBeUndefined();
    });

    it('throws an error when the JSON is invalid', () => {
      (victim as any).load = jest.fn().mockReturnValue('invalid-json');
      const params = { name: 'invalid-json' };
      expect(() => victim.json(params)).toThrowError(
        'Failed to parse JSON from secret invalid-json'
      );
    });
  });

  it('returns the string value', () => {
    (victim as any).load = jest.fn().mockReturnValue('string');
    const params = { name: 'string' };
    const val = victim.string(params);
    expect(val).toEqual('string');
  });

  describe('bool', () => {
    it('returns true for the string "true"', () => {
      (victim as any).load = jest.fn().mockReturnValue('true');
      const params = { name: 'true' };
      const val = victim.bool(params);
      expect(val).toEqual(true);
    });

    it('returns false for the string "false"', () => {
      (victim as any).load = jest.fn().mockReturnValue('false');
      const params = { name: 'false' };
      const val = victim.bool(params);
      expect(val).toEqual(false);
    });

    it('returns false when the value is empty', () => {
      (victim as any).load = jest.fn().mockReturnValue(undefined);
      const params = { name: 'empty' };
      const val = victim.bool(params);
      expect(val).toEqual(false);
    });
  });

  describe('float', () => {
    it('returns the float value', () => {
      (victim as any).load = jest.fn().mockReturnValue('1.1');
      const params = { name: '1.1' };
      const val = victim.float(params);
      expect(val).toEqual(1.1);
    });

    it('returns undefined when the value is empty', () => {
      (victim as any).load = jest.fn().mockReturnValue(undefined);
      const params = { name: 'empty' };
      const val = victim.float(params);
      expect(val).toBeUndefined();
    });
  });

  describe('int', () => {
    it('returns the int value', () => {
      (victim as any).load = jest.fn().mockReturnValue('1');
      const params = { name: '1' };
      const val = victim.int(params);
      expect(val).toEqual(1);
    });

    it('returns undefined when the value is empty', () => {
      (victim as any).load = jest.fn().mockReturnValue(undefined);
      const params = { name: 'empty' };
      const val = victim.int(params);
      expect(val).toBeUndefined();
    });
  });
});
