var wtj = require('./index')

wtj.extractUrl(process.env.DOMAIN, {
})
.then(function(res) {
  console.log(JSON.stringify(res, null, 2));
})
