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

  const testTweet = tweet => {
    expect(tweet).toEqual({
      id: expect.any(Number),
      author: 'jack',        
      title: 'my tweet',
      body: 'this is a great tweet',
      created: expect.any(String),
    });
  };

  it('creates a note', () => {
    return createTweet()
      .then(res => {
        testTweet(res.body);
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
        testTweet(res.body);
      });
  });

  it('gets all tweets', () => {
    Promise.all([
      createTweet({ title: 'tweet 1', body: 'tweet body 1', author: 'author 1' }),
      createTweet({ title: 'tweet 2', body: 'tweet body 2', author: 'author 2' }),
      createTweet({ title: 'tweet 3', body: 'tweet body 3', author: 'author 1' }),
      createTweet({ title: 'tweet 4', body: 'tweet body 4', author: 'author 2' }),
      createTweet({ title: 'tweet 5', body: 'tweet body 5', author: 'author 3' }),
    ]);
    return request(app)
      .get('/api/v1/tweets')
      .then(res => {
        expect(res.body).toHaveLength(5);
      });
  });

  it('updates a tweet', () => {
    return createTweet()
      .then(({ body }) => {
        body.title = 'updated title';
        return request(app)
          .put(`/api/v1/tweets/${body.id}`)
          .send(body)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          id: expect.any(Number),
          author: 'jack',        
          title: 'updated title',
          body: 'this is a great tweet',
          created: expect.any(String),
        });
      });
  });

  it('deletes a tweet', () => {
    return createTweet()
      .then(({ body }) => {
        return request(app)
          .delete(`/api/v1/tweets/${body.id}`)
          .expect(200);
      })
      .then(({ body }) => {
        testTweet(body);
      });
  });
});
