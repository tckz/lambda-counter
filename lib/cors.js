'use strict';

/**
 * headers中のOriginの値が、ホワイトリストに該当したら
 * レスポンスヘッダにAccess-Control-Allow-Originとして追加する
 */
exports.addAllowOrigin = (allowedOrigins, headers, responseHeaders) => {
  const origin = headers.origin || headers.Origin;
  if (origin != null) {
    const found = allowedOrigins.find(e => e.test(origin));
    if (found != null) {
      responseHeaders['Access-Control-Allow-Origin'] = origin;
    }
  }

  return responseHeaders;
};

