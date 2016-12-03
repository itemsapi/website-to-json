'use strict';

var sinon = require('sinon')
var should = require('should');
var Promise = require('bluebird')
var _ = require('lodash')
var converter = require('../src/html-to-data')
var assert = require('assert')

describe('user manager', function() {

  before(function before(done) {
    done()
  })

  it('find simple recipe', function test(done) {

    var result = converter.findRecipe(
      'my_url.com', {
        recipes: [{
          title: 'myurl',
          pattern: '(my_url)\.com',
        }]
      }
    )

    assert.equal(result.title, 'myurl')
    done()
  })

  it('find recipe', function test(done) {

    var result = converter.findRecipe(
      'my_url.com/id/5', {
        recipes: [{
          title: 'myurl',
          pattern: '(my_url)\.com/(id)/([0-9]+)',
        }]
      }
    )

    assert.equal(result.title, 'myurl')
    done()
  })

  it('find keywords', function test(done) {
    var result = converter.findKeywords(
      'pricing blog', ['pricing']
    )
    assert.deepEqual(result, ['pricing'])

    var result = converter.findKeywords(
      'pricing Blog', ['pricing', 'blog']
    )
    assert.deepEqual(result, ['pricing', 'blog'])
    done()
  })
})
