#!/usr/bin/env node

var program = require('commander');
var Promise = require('bluebird')
var colors = require('colors');
var extractor = require('./../index')

program
  .version('0.0.1')
  //.usage('[options] <file ...>')
  .usage('<url>')

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp(make_red);
}

function make_red(txt) {
  return colors.red(txt);
}

var url = process.argv[2]
console.log(`Converting ${url} to JSON..`.green);

return extractor.extractUrl(url, {
  //stringify: true
})
.then((res) => {
  //console.log(res);
  if (!res.data) {
    console.log(`System has found only basic data. To make it more intelligent please add appropriate recipe in './recipe.js'`.red);
    console.log(`Your contribution will make it more useful for another people`.red);
  }
  console.log('Response: '.green);
  console.log(JSON.stringify(res, null, 2));
})
.catch((res) => {
  console.log('An error occured: '.red);
  console.log(res);
  console.log(res.message);
})
