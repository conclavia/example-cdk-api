/* eslint-disable import/prefer-default-export, @typescript-eslint/no-unsafe-assignment */

import createApi from './api';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const awsLambdaFastify = require('aws-lambda-fastify');

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export const handler = awsLambdaFastify(createApi());
