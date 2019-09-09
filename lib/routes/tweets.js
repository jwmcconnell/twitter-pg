const { Router } = require('express');
const client = require('../utils/client');

module.exports = Router()
  .get('/', (req, res, next) => {
    client.query(`
      select
          id,
          author,
          title,
          body,
          created
        from tweets
    `)
      .then(result => res.send(result.rows))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    client.query(`
      select
        id,
        author,
        title,
        body,
        created
      from tweets
      where id = $1;
    `, [req.params.id])
      .then(result => {
        const tweet = result.rows[0];
        if(!tweet) {
          throw {
            status: 404,
            message: `Id ${req.params.id} does not exist`
          };
        }
        res.send(tweet);
      })
      .catch(next);
  })

  .post('/', (req, res, next) => {
    const { title, body, author } = req.body;

    client.query(`
      insert into tweets (title, body, author)
      values ($1, $2, $3)
      returning 
        id, title, body, author, created
    `, [title, body, author])
      .then(result => res.send(result.rows[0]))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const { title, body } = req.body;

    client.query(`
      update tweets
        set title = $1,
            body = $2
      where id = $3
      returning
        id, title, body, author, created
    `, [title, body, req.params.id])
      .then(result => res.send(result.rows[0]))
      .catch(next);
  });
