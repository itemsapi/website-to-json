var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var converter = require('./src/html-to-data')

exports.processUrlWithRequestAsync = function(data, options) {
  return request.getAsync({
    url: data.url,
    jar: true,
    gzip: true,
    timeout: options.timeout || 3000,
    headers: {'accept-languages': 'en'},
    forever: true
  })
  .then(function(res) {
    if (res.statusCode === 429) {
      throw new Error('blocked 429')
    } else if (res.statusCode !== 200) {
      console.log(res.statusCode);
      throw new Error('non 200 status code' + res[0].statusCode)
    }

    return res.body
  })
}

/**
 * recipes
 * timeout
 * type
 * fields
 * keywords
 */
exports.extractUrl = function(url, options) {
  options = options || {}

  if (url.indexOf('http') === -1) {
    url = 'http://' + url
  }

  return exports.processUrlWithRequestAsync({
    url: url
  }, options)
  .catch((err) => {
    throw new Error('Url ' + url + ' seems to be not valid ' + err)
  })
  .then((html) => {
    if (options.stringify) {
      return JSON.stringify(converter.convert(url, html, options), null, 2)
    }
    return converter.convert(url, html, options)
  })
}
