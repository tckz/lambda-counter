'use strict';

const counter = require("./lambda-counter");

new Promise((resolve, reject) => {
    counter.handler({}, {}, (err, res) => {
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

