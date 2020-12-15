import 'source-map-support/register';
import { App, Tags } from '@aws-cdk/core';

import config from './config';
import loadTags from './loadTags';

import CoreStack from './core.cdk';

const {
  database: { tableName },
  network: { apiDomainName, hostedZoneName, apiCorsAllowedOrigins },
  paths: { package: packageDirectory, tags: tagsFile },
  stackNames: { core: coreStackName },
  stackParameters,
} = config;

const app = new App();

loadTags(tagsFile).forEach(([key, value]) => Tags.of(app).add(key, value));

new CoreStack(app, coreStackName, {
  apiCorsAllowedOrigins,
  apiDomainName,
  hostedZoneName,
  packageDirectory,
  tableName,
  ...stackParameters,
});
