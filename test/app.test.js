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

  const TEST_TWEET = { 
    title: 'my tweet', 
    body: 'this is a great tweet', 
    author: 'jack' 
  };

  const createTweet = (tweet = TEST_TWEET) => {
    return request(app)
      .post('/api/v1/tweets')
      .expect(200)
      .send(tweet);
  };

  it('creates a note', () => {
    return createTweet()
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(Number),
          author: 'jack',        
          title: 'my tweet',
          body: 'this is a great tweet',
          created: expect.any(String),
        });
      });
  });

  it('gets a tweet by its id', () => {
    return createTweet()
      .then(res => {
        return request(app)
          .get(`/api/v1/tweets/${res.body.id}`)
          .expect(200);
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(Number),
          author: 'jack',        
          title: 'my tweet',
          body: 'this is a great tweet',
          created: expect.any(String),
        });
      });
  });
});
