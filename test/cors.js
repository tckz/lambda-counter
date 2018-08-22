const assert = require('assert');
const cors = require('../lib/cors');

describe('cors', function() {
  describe('addAllowOrigin()', function() {
    it('オリジンマッチしてヘッダ挿入', function() {
      const actual = cors.addAllowOrigin([/^http:\/\/example\.com$/], {
        'origin': 'http://example.com'
      }, {})

      assert.deepEqual(actual, {
        'Access-Control-Allow-Origin': 'http://example.com',
      });
    });

    // Originが大文字始まり
    it('オリジンマッチしてヘッダ挿入2', function() {
      const actual = cors.addAllowOrigin([/^http:\/\/example\.jp$/, /^http:\/\/example\.com$/], {
        'Origin': 'http://example.com'
      }, {
        'someheader': 'val'
      })

      assert.deepEqual(actual, {
        'Access-Control-Allow-Origin': 'http://example.com',
        'someheader': 'val',
      });
    });

    it('オリジンマッチしないのでヘッダ追加なし', function() {
      const actual = cors.addAllowOrigin(
        [/^http:\/\/example\.com$/, /^http:\/\/example\.jp$/], {
          'origin': 'http://no-example.com'
        }, {
          'someheader': 'val'
        })

      assert.deepEqual(actual, {
        'someheader': 'val'
      });
    });

    it('Originヘッダなし', function() {
      const actual = cors.addAllowOrigin(
        [/^http:\/\/example\.com$/, /^http:\/\/example\.jp$/], {}, {})

      assert.deepEqual(actual, {});
    });
  });
});

