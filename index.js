var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var converter = require('./src/html-to-data')

var processUrlWithRequestAsync = function(data) {
  return request.getAsync({
    url: data.url,
    jar: true,
    gzip: true,
    timeout: 3000,
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

exports.extractUrl = function(url, options) {
  options = options || {}

  if (url.indexOf('http') === -1) {
    url = 'http://' + url
  }

  return processUrlWithRequestAsync({
    url: url
  })
  .catch((err) => {
    //console.log(err);
    throw new Error('Repo ' + url + ' seems to be not valid ' + err)
  })
  .then((html) => {
    if (options.stringify) {
      return JSON.stringify(converter.convert(url, html), null, 2)
    }
    return converter.convert(url, html)
  })
}

