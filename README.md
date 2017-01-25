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

## Nightmare integration

https://github.com/segmentio/nightmare is an automated web browser based on electron. It's similar to phantomjs but simplier and faster. 

The way of working is similar as usual. You only need to provide instance of Nightmare to wtj to make it working:

```js
var Nightmare = require('nightmare');
var nightmare = Nightmare({
  // responsible for showing browser
  show: true
});
var wtj = require('website-to-json')

return wtj.extractUrl('http://www.imdb.com/title/tt0111161/', {
  nightmare: nightmare,
  // recipes are necessary for extracting instructions
  // you can take from another examples
  recipes: recipes,
  fields: ['data', 'meta', 'social'],
})
.then(function(res) {
  console.log(res);
})
```

Please remember to close nightmare instance when you finish your work. The current solution works good on desktop.
If you want it as `headless` it's recommended to install `Xvfb`. You'll find more info here https://github.com/segmentio/nightmare/issues




## CLI

```bash
$ sudo npm install website-to-json -g
$ wtj twitter.com/itemsapi
```
