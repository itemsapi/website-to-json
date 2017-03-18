# Website to json converter (wtj)

This tool converts each website to understandable JSON by jQuery selectors.

## Installation

```bash
$ npm install website-to-json --save
```

## Getting started

### Examples

#### Stack Overflow

```js
var wtj = require('website-to-json')
wtj.extractUrl('http://stackoverflow.com/questions/3207418/crawler-vs-scraper', {
  fields: ['data'],
  parse: function($) {
    return {
      title: $("h1").text(),
      keywords: $('.post-taglist a').map(function(val) {
        return $(this).text()
      }).get()
    }
  }
})
.then(function(res) {
  console.log(JSON.stringify(res, null, 2));
})
```

Response

```js
{
  "data": {
    "title": "crawler vs scraper",
    "keywords": [
      "web-crawler",
      "terminology",
      "scraper"
    ]
  }
}
```

#### IMDB

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
{
  "data": {
    "title": "The Shawshank Redemption (1994)",
    "image": "https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_UX182_CR0,0,182,268_AL_.jpg",
    "summary": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
  }
}
```

## Nightmare integration

https://github.com/segmentio/nightmare is an automated web browser based on electron. It's similar to phantomjs but simplier and faster. 

The way of working is similar as usual. You only need to provide instance of Nightmare to wtj to make it working:

```js
var Nightmare = require('nightmare');
var nightmare = Nightmare({
  show: true,
});

return wtj.extractUrl(val, {
  nightmare: nightmare,
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
