/* eslint-disable unicorn/no-null */

import convict from 'convict';

convict.addFormat({
  name: 'comma-separated-string',
  coerce: (value: string) => (typeof value === 'string' ? (value ?? '').split(',') : value),
  validate: (value) => {
    if (!Array.isArray(value)) {
      throw new TypeError('must be a comma separated string value');
    }
  },
});

const nullString = null as string | null;
const nullArray = null as string[] | null;

const config = convict({
  database: {
    tableName: {
      doc: '',
      env: 'TABLE_NAME',
      format: 'String',
      default: nullString,
    },
  },
  network: {
    apiCorsAllowedOrigins: {
      doc: '',
      env: 'API_ALLOWED_CORS_ORIGINS',
      format: 'comma-separated-string',
      default: nullArray,
    },
    apiDomainName: {
      doc: '',
      env: 'API_DOMAIN_NAME',
      format: 'String',
      default: nullString,
    },
    hostedZoneName: {
      doc: '',
      env: 'HOSTED_ZONE_NAME',
      format: 'String',
      default: nullString,
    },
  },
  paths: {
    package: {
      doc: '',
      env: 'PACKAGE_DIRECTORY',
      format: 'String',
      default: nullString,
    },
    tags: {
      doc: '',
      env: 'TAGS_OUTPUT_FILE',
      format: 'String',
      default: nullString,
    },
  },
  stackNames: {
    core: {
      doc: '',
      env: 'CORE_STACK',
      format: 'String',
      default: nullString,
    },
  },
  stackParameters: {
    env: {
      account: {
        doc: '',
        env: 'CDK_DEFAULT_ACCOUNT',
        format: 'String',
        default: nullString,
      },
      region: {
        doc: '',
        env: 'CDK_DEFAULT_REGION',
        format: 'String',
        default: nullString,
      },
    },
  },
});

config.validate({ allowed: 'strict' });

export default config.get();
