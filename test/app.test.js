require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const client = require('../lib/utils/client');
const child_process = require('child_process');

describe('app routes', () => {
  beforeEach(() => {
    child_process.execSync('npm run recreate-tables');
  });

  afterAll(() => {
    client.end();
  });

  it('creates a note', () => {
    return request(app)
      .post('/api/v1/tweets')
      .send({ title: 'my tweet', body: 'this is a great tweet', author: 'jack' })
      .then(res => {
        expect(res.body).toEqual({
          id: 1,
          author: 'jack',        
          title: 'my tweet',
          body: 'this is a great tweet',
          created: expect.any(String),
        });
      });
  });
});
