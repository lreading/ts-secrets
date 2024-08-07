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
    return parseFloat(val);
  }
  int(params: SecretParams): number {
    const val = this.load(params);
    if (val === undefined) {
      return undefined;
    }
    return parseInt(val, 0);
  }
}
