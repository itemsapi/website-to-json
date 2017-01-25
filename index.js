var _ = require('lodash');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var fs = Promise.promisifyAll(require('fs'));
var converter = require('./src/html-to-data')
//var phantomjs = require('phantomjs-bin');
var Horseman = require('node-horseman');

exports.processUrlWithRequestAsync = function(url, options) {
  options = options || {}
  return request.getAsync({
    url: url,
    jar: true,
    gzip: true,
    timeout: options.timeout || 3000,
    followAllRedirects: true,
    headers: {'accept-languages': 'en'},
    forever: true
  })
  .then(function(res) {
    if (res.statusCode === 429) {
      throw new Error('Request blocked with: 429')
    } else if (res.statusCode !== 200) {
      throw new Error('Non 200 status code: ' + res.statusCode)
    }

    return res.body
  })
}

exports.processUrlWithPhantomAsync = function(url, options) {
  options = options || {}
  return new Promise(function(resolve, reject) {
    var horseman = new Horseman({
      loadImages: false,
      timeout: options.timeout || 5000,
      injectJquery: true,
      //proxy: data.proxy,
      //phantomPath: phantomjs.path
    });
    horseman
    //.userAgent(data.userAgent)
    .open(url)
    /*.on('error', function(msg) {
      throw new Error('Unexpected error')
    })*/
    .html()
    .then(function(body) {
      return resolve(body)
    })
  })
  .catch((err) => {
    throw new Error('Unexpected error')
  })
}

exports.processUrlAsync = function(url, data) {
  if (data.type === 'phantomjs') {
    return exports.processUrlWithPhantomAsync(url, data);
  }
  return exports.processUrlWithRequestAsync(url, data);
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

  if (!url) {
    throw new Error('url is required')
  }

  if (url.indexOf('http') === -1) {
    url = 'http://' + url
  }

  if (options.nightmare) {
    return new Promise(function (resolve, reject) {
      options.nightmare.goto(url)
      .wait('body')
      .evaluate(function(){
        return document.documentElement.innerHTML
        //return document.body.innerHTML
      })
      //.html('html', 'HTMLOnly')
      //.end()
      .then(function(title){
        return resolve(converter.convert(url, title, options))
      })
    }).timeout(10000)
  }

  return exports.processUrlAsync(url, options)
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
