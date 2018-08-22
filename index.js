'use strict';

const counter = require('./lambda-counter');

new Promise((resolve, reject) => {
    counter.handler({
      headers: {
        'Origin': 'http://doc1.example1.com',
      },
    }, {}, (err, res) => {
      const result = {
        error: err,
        response: res,
      };
      resolve(result);
    });
  })
  .then(e => {
    console.log(e);
  });

