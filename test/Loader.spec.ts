import * as fs from 'fs';

import { SecretParams } from '../src/SecretParams';
import { Loader } from '../src/Loader';

class Victim extends Loader {
  int(_params: SecretParams) {
    return 0;
  }
  float(_params: SecretParams) {
    return 0;
  }
  bool(_params: SecretParams) {
    return false;
  }
  string(_params: SecretParams) {
    return '';
  }
  json(_params: SecretParams) {
    return {};
  }
}

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

describe('Loader.ts', () => {
  let victim: Loader;

  beforeEach(() => {
    victim = new Victim();
  });

  describe('load', () => {
    it('should handle default and required, and get the value', () => {
      (victim as any).handleDefaultAndRequired = jest.fn().mockReturnValue('value');
      (victim as any).getValue = jest.fn().mockReturnValue('value');
      const params = { name: 'TEST' };
      const res = (victim as any).load(params);
      expect(res).toEqual('value');
    });
  });

  describe('getValue', () => {
    it('should return the value from process.env if not a file', () => {
      process.env['GET_VALUE_TEST'] = 'value';
      const params = { name: 'GET_VALUE_TEST' };
      const res = (victim as any).getValue(params);
      expect(res).toEqual('value');
      delete process.env['GET_VALUE_TEST'];
    });

    it('should return the value from a file if it is a file', () => {
      (victim as any).loadFromFile = jest.fn().mockReturnValue('file value');
      const params = { name: 'TEST__FILE' };
      const res = (victim as any).getValue(params);
      expect(res).toEqual('file value');
    });
  });

  describe('handleDefaultAndRequired', () => {
    it('should return the default if provided and not required', () => {
      const params = { name: 'TEST', default: 'default' };
      const res = (victim as any).handleDefaultAndRequired(params, undefined);
      expect(res).toEqual('default');
    });

    it('should throw an error if required and not found', () => {
      const params = { name: 'TEST', required: true };
      expect(() =>
        (victim as any).handleDefaultAndRequired(params, undefined)
      ).toThrow('Secret TEST is required, but was not found');
    });

    it('should return the value if found', () => {
      const params = { name: 'TEST' };
      const res = (victim as any).handleDefaultAndRequired(params, 'value');
      expect(res).toEqual('value');
    });
  });

  describe('loadFromFile', () => {
    describe('not required and empty', () => {
      it('should return undefined', () => {
        const params = { name: 'TEST__FILE' };
        const res = (victim as any).loadFromFile(params);
        expect(res).toBeUndefined();
      });
    });

    describe('required but empty', () => {
      it('should throw an error', () => {
        const params = { name: 'TEST__FILE', required: true };
        expect(() => (victim as any).loadFromFile(params)).toThrow(
          'Secret TEST__FILE is required, but was not found'
        );
      });
    });

    describe('happy path', () => {
      const fileDir = '/foo/bar';
      const expected = 'some value';
      let res: string;

      beforeEach(() => {
        process.env['TEST__FILE'] = `${fileDir}/file.txt`;
        (fs.readFileSync as jest.Mock).mockReturnValue(expected);
        res = (victim as any).loadFromFile({ name: 'TEST__FILE', fileDir });
      });

      afterEach(() => {
        delete process.env['TEST__FILE'];
      });

      it('should read the contents of the file', () => {
        expect(fs.readFileSync).toHaveBeenCalledWith(`${fileDir}/file.txt`, 'utf8');
      });

      it('should return the contents of the file', () => {
        expect(res).toEqual(expected);
      });
    });
  });
});
