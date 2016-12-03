# Website to json converter (wtj)

The mission of this tool is to convert each website to understandable JSON.

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

Full options

```js
wtj.extractUrl('twitter.com/itemsapi', {
  recipes: __dirname + '/recipes.js',
  timeout: 3000,
  type: 'request',
  fields: ['meta', 'keywords'],
  keywords: ['pricing', 'blog', 'api', 'javascript']
})
.then(function(res) {
  console.log(res);
})
```

## CLI

```bash
$ sudo npm install website-to-json -g
$ wtj twitter.com/itemsapi
```

To be continued!
