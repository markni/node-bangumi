//Just a simple test for syntax error for now
var assert = require('assert');

var Bangumi = require('../');
var bgm = new Bangumi();

assert(bgm && bgm.hasOwnProperty('options'));