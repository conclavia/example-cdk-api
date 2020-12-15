import * as tPromise from 'io-ts-promise';

import { MessageDecoder } from './message';

describe('MessageDecoder', () => {
  it('successfully parses valid messages', async () => {
    const value = { text: 'hello world' };
    const result = await tPromise.decode(MessageDecoder, value);
    expect(result).toBe(value);
  });

  it('rejects invalid valids', async () => {
    await expect(tPromise.decode(MessageDecoder, { something: 'else' })).rejects.toThrow(
      'Invalid value undefined supplied to : { text: string }/text: string',
    );
  });
});
