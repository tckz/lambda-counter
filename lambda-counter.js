'use strict';

require('dotenv').config();

const aws = require('aws-sdk');
const VError = require('verror');
const uuid = require('uuid/v4');
const redis = require('redis');
const bluebird = require('bluebird');
const sprintf = require('sprintf-js').sprintf;
bluebird.promisifyAll(redis);

const incr = require('./lib/incr');
const cors = require('./lib/cors');

console.log(
  Object.assign({
      Ver: require('./version'),
    },
    process.env.AWS_LAMBDA_FUNCTION_NAME == null ? {} : {
      Env: Object.keys(process.env).sort().map(e => e + '=' + process.env[e]),
    }));

const redisUrl = process.env.REDIS_URL;
if (redisUrl == null) {
  throw new Error('*** ENV-var REDIS_URL must be specified');
}

const allowedOrigins = [
  /^https?:\/\/doc1\.example1\.com$/,
];

exports.handler = async function(event, context, callback) {
  console.info('event: %o', event);
  const client = redis.createClient(redisUrl);
  try {
    client.on('error', function(err) {
      console.error('Error: %o', err);
    });

    console.time('redis');
    const v = await incr(client);
    console.timeEnd('redis');
    if (v % 3 === 0) {
      throw new Error(sprintf('3の倍数であえて例外: %d', v));
    }

    console.time('dynWrite');
    const dyn = new aws.DynamoDB.DocumentClient();
    await dyn.put({
        TableName: 'mydyn',
        Item: {
          id: uuid(),
          count: v,
          expire: Math.floor(new Date().getTime() / 1000) + 3600 * 1,
        },
      })
      .promise()
      .then(d => {
        console.timeEnd('dynWrite');
      });

    const headers = {
      'Access-Control-Allow-Headers': 'Accept,Accept-Language,Content-Language,Content-Type,Authorization,x-correlation-id',
      'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    };
    callback(null, {
      statusCode: 200,
      headers: cors.addAllowOrigin(allowedOrigins, event.headers, headers),
      body: JSON.stringify({
        data: v,
      })
    });
  } catch (err) {
    console.error('event: %o, error: %o', event, err);
    callback(new VError(err, '*** Some error occured'));
  } finally {
    client.quit();
  }
};

