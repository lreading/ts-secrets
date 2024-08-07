import * as fs from 'fs';

import { SecretParams } from './SecretParams';

export abstract class Loader {
  abstract int(params: SecretParams): number;
  abstract float(params: SecretParams): number;
  abstract bool(params: SecretParams): boolean;
  abstract string(params: SecretParams): string;
  abstract json(params: SecretParams): Record<string, unknown>;

  protected load(params: SecretParams): string | undefined {
    return this.handleDefaultAndRequired(params, this.getValue(params));
  }

  private getValue(params: SecretParams): string | undefined {
    if (params.name.endsWith('__FILE')) {
      return this.loadFromFile(params);
    }

    return process.env[params.name];
  }

  private handleDefaultAndRequired(
    params: SecretParams,
    val: string | undefined
  ): string | undefined {
    if (val === undefined && params.default !== undefined) {
      return params.default;
    }

    if (val === undefined && params.required) {
      throw new Error(`Secret ${params.name} is required, but was not found`);
    }

    return val;
  }

  private loadFromFile(params: SecretParams): string {
    const filePath = process.env[params.name];

    if (!params.required && !filePath) {
      return undefined;
    }

    if (!filePath) {
      throw new Error(`Secret ${params.name} is required, but was not found`);
    }

    return fs.readFileSync(filePath, 'utf8');
  }
}
