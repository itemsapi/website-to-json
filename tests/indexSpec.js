'use strict';

var sinon = require('sinon')
var should = require('should');
var Promise = require('bluebird')
var _ = require('lodash')
var service = require('../index')
var assert = require('assert')

describe('user manager', function() {

  before(function before(done) {
    done()
  })

  xit('make request', function test(done) {
    service.extractUrl('twitter.com')
    .then(function(result) {
      console.log(result);
      done()
    })
  })

  it('make request', function test(done) {
    var stub = sinon.stub(service, 'processUrlWithRequestAsync', function(config) {
      return Promise.resolve('<p>test</p>')
    })

    service.extractUrl('my_url.com', {
      recipes: __dirname + '/recipes.js'
    })
    .then(function(result) {
      assert.equal(result.id, 'my_url')
      assert.equal(result.data, 'test')
      stub.restore()
      done()
    })
  })

  it('make request', function test(done) {
    var stub = sinon.stub(service, 'processUrlWithRequestAsync', function(config) {
      return Promise.resolve('<p>test</p>')
    })

    service.extractUrl('my_url.com/id/5', {
      recipes: [{
        title: 'myurl',
        pattern: '(my_url)\.com/(id)/([0-9]+)',
        parse: function($) {
          return $('p').text()
        }
      }]
    })
    .then(function(result) {
      assert.equal(result.id, 'my_url_id_5')
      assert.equal(result.data, 'test')
      stub.restore()
      done()
    })
  })
})
