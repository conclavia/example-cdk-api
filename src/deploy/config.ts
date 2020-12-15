function getString(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} required by configuration was not set`);
  }

  return value;
}

export default {
  database: {
    tableName: getString('TABLE_NAME'),
  },
  network: {
    apiCorsAllowedOrigins: getString('API_ALLOWED_CORS_ORIGINS').split(','),
    apiDomainName: getString('API_DOMAIN_NAME'),
    hostedZoneName: getString('HOSTED_ZONE_NAME'),
  },
  paths: {
    package: getString('PACKAGE_DIRECTORY'),
    tags: getString('TAGS_OUTPUT_FILE'),
  },
  stackNames: {
    core: getString('CORE_STACK'),
  },
  stackParameters: {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  },
};
