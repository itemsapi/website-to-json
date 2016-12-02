# Don't use it - it is still in heavy dev

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
  recipes: './recipes.js',
  timeout: 3000,
  fields: ['meta', 'social', 'emails', 'id']
})
.then(function(res) {
  console.log(res);
})
```

## CLI

```bash
$ wtj twitter.com/itemsapi
```

To be continued!
