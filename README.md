# TSSecrets
Lightweight Typescript library (0 direct dependencies) to abstract away reading secrets from the environment or files.  This works similar to how other libraries and packages work, where you can provide an environment variable as the name, or if you append `__FILE` to the end of the variable name, it will read the file at the path specified in the environment variable.

## Usage
Using your preferred method to load secrets to the environment or filesystem, you can retrieve them using the following methods:
```TypeScript
import secrets from '@lreading/ts-secrets';

const port = secrets.int({ name: 'PORT', required: false, default: 3000 });
const db = secrets.string({ name: 'DB__FILE', required: true });
const config = secrets.json({ name: 'CONFIG', required: true });
const isDev = secrets.bool({ name: 'IS_DEV', required: false, default: false });
const timeout = secrets.float({ name: 'TIMEOUT', required: false, default: 5.0 });
```

## Supported "Types"

Types are in quotes, because a couple of these aren't real types, but I find myself using frequently.  For example, int vs float:  An "int" is useful in the case of defining a port number when configuring a server, whereas it's really just a "number" under the hood.  I made the distinction between ints and floats due to the way the values are parsed.

- string
- int
- float
- bool
- json (parses a string into an object)
