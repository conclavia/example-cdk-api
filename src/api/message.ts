import * as t from 'io-ts';

export const MessageDecoder = t.type({
  text: t.string,
});

export type Message = t.TypeOf<typeof MessageDecoder>;
