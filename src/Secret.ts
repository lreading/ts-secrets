import { Loader } from './Loader';
import { SecretParams } from './SecretParams';

export class Secret extends Loader {
  json(params: SecretParams): Record<string, unknown> {
    const val = this.load(params);
    if (typeof val !== 'string') {
      return undefined;
    }
    try {
      return JSON.parse(val);
    } catch (error) {
      throw new Error(`Failed to parse JSON from secret ${params.name}`);
    }
  }
  string(params: SecretParams): string {
    return this.load(params);
  }
  bool(params: SecretParams): boolean {
    const val = this.load(params);
    if (val === undefined) {
      return false;
    }
    return val.toLowerCase() === 'true';
  }
  float(params: SecretParams): number {
    const val = this.load(params);
    if (val === undefined) {
      return undefined;
    }
    const parsed = parseFloat(val);
    if (isNaN(parsed)) {
      throw new Error(`Invalid float value for secret ${params.name}: "${val}"`);
    }
    return parsed;
  }
  int(params: SecretParams): number {
    const val = this.load(params);
    if (val === undefined) {
      return undefined;
    }
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      throw new Error(`Invalid integer value for secret ${params.name}: "${val}"`);
    }
    return parsed;
  }
}
