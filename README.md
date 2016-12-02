# Website to json converter (wtj)

The mission of this tool is to convert each website to understandable JSON.

## Installation

```bash
$ npm install website-to-json --save
```

## Getting started

```js
var wtj = require('website-to-json')

wtj.extractUrl('twitter.com/itemsapi')
.then(function(res) {
  console.log(res);
})
```

## CLI

```bash
$ wtj twitter.com/itemsapi
```

To be continued!
