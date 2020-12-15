import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import fastify, { FastifyInstance } from 'fastify';
import * as tPromise from 'io-ts-promise';
import { v1 as uuid } from 'uuid';

import configuration from './configuration';
import { MessageDecoder } from './message';

const {
  aws,
  database: { tableName: TableName },
} = configuration;

const db = new DocumentClient(aws);

export default function createApi(): FastifyInstance {
  const api = fastify({ logger: true });

  api.get('/messages', async (_, reply) => {
    const messages = await db
      .scan({
        TableName,
      })
      .promise();

    await reply.send(messages.Items ?? []);
  });

  api.post('/messages', async (request, reply) => {
    const input = await tPromise.decode(MessageDecoder, request.body);

    const item = {
      id: uuid(),
      ...input,
    };

    await db
      .put({
        TableName,
        Item: item,
      })
      .promise();

    await reply.send(item);
  });

  return api;
}
