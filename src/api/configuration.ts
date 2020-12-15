export type Configuration = {
  aws: {
    region: string;
    endpoint?: string;
  };
  database: {
    tableName: string;
  };
};

const configuration: Configuration = {
  aws: {
    region: process.env.AWS_DEFAULT_REGION!,
    ...(process.env.NODE_ENV === 'development'
      ? { endpoint: process.env.LOCALSTACK_ENDPOINT }
      : {}),
  },
  database: {
    tableName: process.env.TABLE_NAME!,
  },
};

export default configuration;
