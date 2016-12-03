var S = require('string')
var _ = require('lodash')
var trim = require('trim')

var array = [
  {
    title: 'myurl',
    pattern: '(my_url)\.com',
    parse: function($) {
      return $('p').text()
    }
  }
]

module.exports = array;
