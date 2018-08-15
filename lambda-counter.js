'use strict';

const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);
const incr = require("./lib/incr");

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

    callback(null, {
      statusCode: 200,
      headers: {},
      body: JSON.stringify({
        data: v,
      })
    });
  } catch (err) {
    console.error("event: %o, error: %o", event, err);
    callback(new Error("*** " + err))
  } finally {
    client.quit();
  }
};

