'use strict';

module.exports = async function incr(client) {
  const v = await client.incrAsync("kkkk");
  return v;
};


