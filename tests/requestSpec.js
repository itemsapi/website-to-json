'use strict';

var sinon = require('sinon')
var should = require('should');
var Promise = require('bluebird')
var _ = require('lodash')
var service = require('../index')
var assert = require('assert')
var nock = require('nock');

describe('make real request with mock response', function() {

  before(function before(done) {
    var scope = nock('http://www.example.com')
    .persist()
    .get('/')
    .reply(200, '<div id="main">test</div>')
    done()
  })

  after(function before(done) {
    nock.cleanAll();
    done()
  })

  it('make scrap', function test(done) {

    var recipes = [{
      parse: function($) {
        return {
          name: $('#main').text(),
        }
      }
    }]

    service.extractUrl('http://www.example.com/', {
      recipes: recipes
    })
    .then(function(result) {
      assert.equal('test', result.data.name);
      done()
    })
  })

  it('make simple scrap', function test(done) {

    service.extractUrl('http://www.example.com/', {
      recipe: {
        parse: function($) {
          return {
            name: $('#main').text(),
          }
        }
      }
    })
    .then(function(result) {
      assert.equal('test', result.data.name);
      done()
    })
  })

  it('make simple scrap even easier', function test(done) {

    service.extractUrl('http://www.example.com/', {
      parse: function($) {
        return {
          name: $('#main').text(),
        }
      }
    })
    .then(function(result) {
      assert.equal('test', result.data.name);
      done()
    })
  })

  it('make simple scrap but not return data', function test(done) {

    service.extractUrl('http://www.example.com/', {
      fields: [],
      parse: function($) {
        return {
          name: $('#main').text(),
        }
      }
    })
    .then(function(result) {
      assert.equal(undefined, result.data);
      done()
    })
  })
})
