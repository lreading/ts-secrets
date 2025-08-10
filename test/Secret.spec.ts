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

    it('throws error for invalid string values', () => {
      (victim as any).load = jest.fn().mockReturnValue('not-a-number');
      const params = { name: 'INVALID_FLOAT' };
      expect(() => victim.float(params)).toThrow('Invalid float value for secret INVALID_FLOAT: "not-a-number"');
    });

    it('throws error for empty string values', () => {
      (victim as any).load = jest.fn().mockReturnValue('');
      const params = { name: 'EMPTY_FLOAT' };
      expect(() => victim.float(params)).toThrow('Invalid float value for secret EMPTY_FLOAT: ""');
    });

    it('parses scientific notation correctly', () => {
      (victim as any).load = jest.fn().mockReturnValue('1.5e10');
      const params = { name: 'SCIENTIFIC' };
      const val = victim.float(params);
      expect(val).toEqual(1.5e10);
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

    it('correctly parses default integer values', () => {
      (victim as any).load = jest.fn().mockReturnValue('3000');
      const params = { name: 'PORT', default: '3000' };
      const val = victim.int(params);
      expect(val).toEqual(3000);
      expect(val).not.toBeNaN();
    });

    it('handles default values that could be misinterpreted with radix 0', () => {
      (victim as any).load = jest.fn().mockReturnValue('08');
      const params = { name: 'NUM', default: '08' };
      const val = victim.int(params);
      expect(val).toEqual(8);
      expect(val).not.toBeNaN();
    });

    it('throws error for invalid string values', () => {
      (victim as any).load = jest.fn().mockReturnValue('not-a-number');
      const params = { name: 'INVALID' };
      expect(() => victim.int(params)).toThrow('Invalid integer value for secret INVALID: "not-a-number"');
    });

    it('parses leading numbers from mixed strings', () => {
      (victim as any).load = jest.fn().mockReturnValue('123abc');
      const params = { name: 'MIXED' };
      const val = victim.int(params);
      expect(val).toEqual(123);
    });

    it('throws error for empty string values', () => {
      (victim as any).load = jest.fn().mockReturnValue('');
      const params = { name: 'EMPTY' };
      expect(() => victim.int(params)).toThrow('Invalid integer value for secret EMPTY: ""');
    });

    it('throws error for whitespace-only values', () => {
      (victim as any).load = jest.fn().mockReturnValue('   ');
      const params = { name: 'WHITESPACE' };
      expect(() => victim.int(params)).toThrow('Invalid integer value for secret WHITESPACE: "   "');
    });

    it('throws error when invalid default value is used', () => {
      (victim as any).load = jest.fn().mockReturnValue('invalid-default');
      const params = { name: 'BAD_DEFAULT', default: 'invalid-default' };
      expect(() => victim.int(params)).toThrow('Invalid integer value for secret BAD_DEFAULT: "invalid-default"');
    });
  });
});
