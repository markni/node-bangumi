//Just a simple test for syntax error for now
const assert = require('assert');

const Bangumi = require('../');
const bgm = new Bangumi({debug: true});

assert(bgm && Object.prototype.hasOwnProperty.call(bgm, 'options'));

bgm.auth({protocol: 'http'}, 2);

const test = async () => {
  let user = await bgm.fetchUser('ruocaled');
  console.log(user.avatar.large);
};

test();