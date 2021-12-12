//Just a simple test for syntax error for now
const assert = require('assert');

const Bangumi = require('../');
const bgm = new Bangumi({debug: true});

assert(bgm && Object.prototype.hasOwnProperty.call(bgm, 'options'));