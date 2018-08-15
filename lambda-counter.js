'use strict';

require('dotenv').config();
const VError = require('verror');

const redis = require("redis");
const bluebird = require("bluebird");
const sprintf = require("sprintf-js").sprintf;
bluebird.promisifyAll(redis);

const incr = require("./lib/incr");

console.log(
  Object.assign({
      Ver: require("./version"),
    },
    process.env.AWS_LAMBDA_FUNCTION_NAME == null ? {} : {
      Env: Object.keys(process.env).sort().map(e => e + "=" + process.env[e]),
    }));

const redisUrl = process.env.REDIS_URL;
if (redisUrl == null) {
  throw new Error("*** ENV-var REDIS_URL must be specified");
}

exports.handler = async function(event, context, callback) {
  console.info("event: %o", event);
  const client = redis.createClient(redisUrl);
  try {
    client.on("error", function(err) {
      console.error("Error: %o", err);
    });

    const v = await incr(client);
    if (v % 3 == 0) {
      throw new Error(sprintf("3の倍数であえて例外: %d", v));
    }

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin' : '*',
      },
      body: JSON.stringify({
        data: v,
      })
    });
  } catch (err) {
    console.error("event: %o, error: %o", event, err);
    callback(new VError(err, "*** Some error occured"));
  } finally {
    client.quit();
  }
};

