# Website to json converter (wtj)

This tool converts each website to understandable JSON by jQuery recipes.

## Installation

```bash
$ npm install website-to-json --save
```

## Getting started

Basic

```js
var wtj = require('website-to-json')

wtj.extractUrl('twitter.com/itemsapi')
.then(function(res) {
  console.log(res);
})
```

Example

```js
var trim = require('trim')
var wtj = require('website-to-json')

var recipes = [{
  title: 'imdb',
  pattern: '(imdb)\.com/title/(.*)/',
  parse: function($) {
    return {
      name: trim($("h1").text()),
    }
  }
}]

wtj.extractUrl('http://www.imdb.com/title/tt0111161/', {
  fields: ['data'],
  recipes: recipes
})
.then(function(res) {
  console.log(res);
})
```

Response

```js
{ data: { name: 'The Shawshank Redemption (1994)' } }
```

## CLI

```bash
$ sudo npm install website-to-json -g
$ wtj twitter.com/itemsapi
```
