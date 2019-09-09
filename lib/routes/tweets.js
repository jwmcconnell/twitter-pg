const { Router } = require('express');
const client = require('../utils/client');

module.exports = Router()
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
  });

