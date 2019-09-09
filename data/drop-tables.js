/* eslint-disable no-console */
const client = require('../lib/utils/client');

client.query(`
    DROP TABLE IF EXISTS tweets;
`)
  .then(
    () => console.log('drop tables complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });
