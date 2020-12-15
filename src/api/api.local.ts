/* eslint-disable unicorn/no-process-exit */

import createApi from './api';

const api = createApi();

api.listen(3000, (err, address) => {
  if (err) {
    api.log.fatal({ err }, 'Terminating server due to an unhandled exception');
    process.exit(1);
  }
  api.log.info({ address }, 'API server started');
});
