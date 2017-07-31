const _ = require('lodash');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'));
const fs = Promise.promisifyAll(require('fs'));
const converter = require('./src/html-to-data')
const Horseman = require('node-horseman');
const logger = require('winston');

exports.processUrlWithRequestAsync = function(url, options) {
  options = options || {}

  return request.getAsync({
    url: url,
    jar: true,
    encoding: options.encoding,
    gzip: true,
    timeout: options.timeout || 8000,
    followAllRedirects: options.followAllRedirects || true,
    headers: options.headers || {'accept-languages': 'en'},
    forever: options.forever === false ? false : true
  })
  .then(function(res) {
    if (res.statusCode === 429) {
      throw new Error('Request blocked with: 429');
    } else if (res.statusCode !== 200) {
      throw new Error('Non 200 status code: ' + res.statusCode);
    }

    return {
      body: res.body,
      headers: res.headers,
      http: {
        statusCode: res.statusCode
      },
      url: res.request.href,
      originalUrl: url
    };
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
      return resolve({
        body: body,
        originalUrl: url
      });
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

  var DEBUG = !!(process.env.DEBUG || options.debug);

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
      })
      .then(function(title) {
        return resolve(converter.convert(url, title, options));
      })
    }).timeout(10000)
  }

  if (DEBUG) logger.profile('get html ' + url);

  return exports.processUrlAsync(url, options)
  .catch((err) => {
    throw new Error('Url ' + url + ' seems to be not valid ' + err);
  })
  .then((result) => {
    if (DEBUG) logger.profile('get html ' + url);

    if (DEBUG) logger.profile('process html ' + url);
    var output = _.merge(converter.convert(url, result.body, options), {
      url: result.url,
      originalUrl: result.originalUrl
    });

    if (options.headers === true) {
      output.headers = result.headers;
    }

    if (options.http === true) {
      output.http = result.http;
    }

    if (output.id === 'id_not_specified') {
      delete output.id;
    }

    if (options.stringify) {
      return JSON.stringify(output, null, 2);
    }

    if (DEBUG) logger.profile('process html ' + url);
    return output;
  })
}

exports.extractData = exports.extractUrl;
