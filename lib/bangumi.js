/**
 * Bangumi API client library for node.js.
 * @module bangumi
 * @version 1.1.0
 */

var	VERSION = '1.1.0';
var protocols = {
  http: require('http'),
  https: require('https'),
};
var querystring = require('querystring');
var utils = require('./utils');
var PromiseProvider = require('./promise_provider');
var nodeBangumiAppId = 'bgm2305af4de0f06a38'; //for debug


/**
 * @class Bangumi
 * @param [options] {object}
 * @param [options.app_id] {string} app id used for identify source, deprecated
 * @param [options.access_token] {string} access token used for identify user
 * @param [options.protocol] {string} http protocol used for api
 * @example
 * var Bangumi = require('bangumi');
 * var bgm = new Bangumi({
 *   access_token: "123456"
 * });
 */

function Bangumi(options){
  if (!(this instanceof Bangumi)) return new Bangumi(options);
  var defaults = {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Connection': 'close',
      'User-Agent': 'node-bangumi/' + VERSION
    },

    callback_url: null,
    rest_base : 'api.bgm.tv',
    cookie_options: {},
    cookie_secret: null
  };
  this.options = utils.merge(defaults, options);
}

Bangumi.VERSION = VERSION;
module.exports = Bangumi;

/**
 * Set custom promise provider, default using nodejs ES6 promise provider
 * @param provider {function} Custom promise provider
 * @example
 * //use bluebird as provider, so you can use things like .finally()
 * bgm.setPromiseProvider(require('bluebird'));
 */
Bangumi.prototype.setPromiseProvider = function(provider) {
  PromiseProvider.set(provider);
};

/**
 * Update access toke in case it's refreshed
 * @param access_token {string} the new access token
 * @example
 * bgm.setAccessToken('123456');
 */
Bangumi.prototype.setAccessToken = function(access_token) {
  this.options['access_token'] = access_token;
};


Bangumi.prototype._get = function(url, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }


  if ( typeof callback !== 'function' ) {
    throw 'FAIL: INVALID CALLBACK.';
  }

  if (url.charAt(0) !== '/')        {
    throw 'FAIL: INVALID URL.';
  }

  if (Object.prototype.hasOwnProperty.call(this.options, 'app_id')) params = utils.merge({source:this.options.app_id}, params);


  var protocolName = this.options.protocol || 'https';


  var options = {
    host: this.options.rest_base,
    path: encodeURI(url + (querystring.stringify(params) ? '?' : '') + querystring.stringify(params)),
    method: 'GET',
    headers: this.options.headers
  };

  if (Object.prototype.hasOwnProperty.call(this.options, 'access_token')) options.headers['Authorization'] = 'Bearer ' + this.options.access_token;

  var req = protocols[protocolName].request(options, function(res){
    var data = '';
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      data += chunk;
    });

    res.on('end', function () {
      try {
        var json = JSON.parse(data);
        if (Object.prototype.hasOwnProperty.call(json, 'error')) callback(json, {});
        else callback(null, json);
      } catch(err) {
        callback(err, {});
      }
    });

    res.on('error', function(err) {
      callback(err, {});
    });
  });

  req.end();
};

/**
 * A general GET request method for Bangumi API
 * @param url {string} base GET request path
 * @param params {object} parameters used for GET query string
 * @param [callback] {function} callback function
 */
Bangumi.prototype.get = function(url, params, callback) {
  var self = this;
  return utils.promiseOrCallback(callback, function(cb){
    self._get(url, params, cb);
  });
};

Bangumi.prototype._post = function(url, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  if ( typeof callback !== 'function' ) {
    throw 'FAIL: INVALID CALLBACK.';
  }

  if (url.charAt(0) !== '/')        {
    throw 'FAIL: INVALID URL.';
  }

  var protocolName = this.options.protocol || 'https';

  var post_data =  querystring.stringify(params);

  var headers = utils.merge({'Content-Length': post_data.length}, this.options.headers);

  var options = {
    host: this.options.rest_base,
    path: encodeURI(url),
    method: 'POST',
    headers: headers
  };

  if (Object.prototype.hasOwnProperty.call(this.options, 'access_token')) options.headers['Authorization'] = 'Bearer ' + this.options.access_token;
  if (Object.prototype.hasOwnProperty.call(this.options, 'app_id')) options.path += '?' + querystring.stringify({source: this.options.app_id});

  var req = protocols[protocolName].request(options, function(res){
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });

    res.on('end', function () {
      try {
        var json = JSON.parse(data);
        if (Object.prototype.hasOwnProperty.call(json, 'error')) callback(json, {});
        else callback(null, json);
      } catch(err) {
        callback(err, {});
      }
    });

    res.on('error', function(err) {
      callback(err, {});
    });
  });

  req.write(post_data);
  req.end();
};

/**
 * A general POST reqeust method for Bangumi API
 * @param url {string} base POST request path
 * @param params {object} parameters used for POST body
 * @param [callback] {function} callback function
 * @returns {Promise}
 */

Bangumi.prototype.post = function(url, params, callback) {
  var self = this;
  return utils.promiseOrCallback(callback, function(cb){
    self._post(url, params, cb);
  });
};


/**
 * A GET method that gets current weekly shows' seclude
 * @param [callback] {function} callback function
 * @returns {Promise}
 */
Bangumi.prototype.fetchCalendar = function(callback) {
  var url = '/calendar';
  return this.get(url, callback);
};

/**
 * A GET method that gets target user's profile
 * @param username {string|number} username or uid of target username
 * @param [callback] {function} callback function
 * @returns {Promise}
 */
Bangumi.prototype.fetchUser = function(username, callback){
  var url = '/user/' + username;
  return this.get(url, callback);
};

/**
 * A GET method that gets a details of a subject by id
 * @param subject_id {integer} id of target subject
 * @param [params] {object}
 * @param [params.responseGroup] {string} accept [small|medium|large]
 * @param [callback] {function} callback function
 * @returns {Promise}
 */
Bangumi.prototype.fetchSubject = function(subject_id, params, callback){
  var url = '/subject/' + subject_id;
  return this.get(url, params, callback);
};

/**
 * A GET method that gets a list of episodes of a subject by subject id
 * @param subject_id {integer} id of target subject
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @deprecated use fetchSubjectEps
 */

Bangumi.prototype.fetchEps = function(subject_id, callback){
  return this.fetchSubjectEps(subject_id, callback);
};

/**
 * A GET method that gets a list of episodes of a subject by subject id
 * @param subject_id {integer} id of target subject
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @example
 * bgm.fetchSubjectEps(211567);
 */
Bangumi.prototype.fetchSubjectEps = function(subject_id, callback){
  var url = '/subject/' + subject_id + '/ep';
  return this.get(url, callback);
};

/**
 * A GET method that gets details of user's collection by user id
 * @param username {string} username or uid of target username
 * @param params {object}
 * @param params.cat {string} type of the collections, accepts [watching|all_watching]
 * @param [params.responseGroup] {string} type of the collections, accepts [medium|small]
 * @param [params.ids] {string} ids of subjects users wants to fetch, this is very poorly implemented at the moment
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @example
 * bgm.fetchUserCollection(1, {cat:'all_watching', responseGroup: 'small'}).then(console.log)
 */
Bangumi.prototype.fetchUserCollection = function(username, params, callback){
  var url = '/user/' + username + '/collection';
  return this.get(url, params, callback);
};

/**
 * A GET method that gets overview of user's collection by username and subject type
 * @param username {string} username or uid of target username
 * @param subject_type {string} type of subject
 * @param [params] {object}
 * @param [params.max_results] {integer} upper limit of amount of subjects client can fetch (max 25)
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @example
 * bgm.fetchUserCollections('sai', 'real', {max_results: 1}).then(console.log).catch(console.error)
 */
Bangumi.prototype.fetchUserCollections = function(username, subject_type, params, callback){
  //note here using our appid due to a api bug: https://github.com/bangumi/api/issues/24
  if(typeof params === 'object' && !Object.prototype.hasOwnProperty.call(params, 'app_id')) params.app_id = nodeBangumiAppId;
  if(typeof params === 'undefined') params = {app_id : nodeBangumiAppId};

  var url = '/user/' + username + '/collections' + (subject_type ? '/' : '') + subject_type;
  return this.get(url, params, callback);
};


/**
 * A GET method that gets overview of user's collection statics by username
 * @param username {string} username or uid of target username
 * @param [params] {object}
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @example
 * bgm.fetchUserCollectionsStatus('sai').then(console.log).catch(console.error)
 */
Bangumi.prototype.fetchUserCollectionsStatus = function(username, params, callback){
  //note here using our appid due to a api bug: https://github.com/bangumi/api/issues/24
  if(typeof params === 'object' && !Object.prototype.hasOwnProperty.call(params, 'app_id')) params.app_id = nodeBangumiAppId;
  if(typeof params === 'undefined') params = {app_id : nodeBangumiAppId};

  var url = '/user/' + username + '/collections/status';
  return this.get(url, params, callback);
};


/**
 * A GET method that searches and returns a list of subjects by keywords
 * @param keywords {string} query string for search
 * @param [params] {object}
 * @param [params.responseGroup] {string} accept [small|medium|large]
 * @param [params.type] {integer} accept [1|2|3|4|6] (1.book 2.anime 3.music 4.game 5.live action)
 * @param [params.start] {integer} result start index, used for paging
 * @param [params.max_results] {integer} the number of entries returns, max 25
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @example
 * bgm.search('天元突破');
 */
Bangumi.prototype.search = function(keywords, params, callback){
  var url =  '/search/subject/' + keywords;
  return this.get(url, params, callback);
};



/**
 * A GET method that get lists of episodes that user already watched, sorted by subject id
 * @param username {string|number} username or uid of target username
 * @param [params] {object}
 * @param [params.subject_id] {integer} the id of the subject user wants fetch progress
 * @param [params.auth] {string} authentication string used for validation of user identity, deprecated
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @example
 * bgm.fetchProgress(1, {subject_id:899}).then(console.log);
 */
Bangumi.prototype.fetchProgress = function(username, params, callback){
  var url = '/user/' + username + '/progress';
  return this.get(url, params, callback);
};

/**
 * A POST method that login user with username and password, and returns auth string
 * @param params {object}
 * @param params.username {string} username or uid of target username
 * @param params.password {string} password for target user
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @deprecated since version 1.0.0, newer version of api will use oauth.
 */

Bangumi.prototype.auth = function(params, callback){
  console.warn('auth() will be deprecated in the near future');
  var url = '/auth';
  return this.post(url, params, callback);
};

/**
 * A GET method that get current user's collection details on specific subject by subject id
 * @param subject_id {integer} id of target subject
 * @param [params] {object}
 * @param [params.auth] {string} authentication string used for validation of user identity, deprecated
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @example
 * bgm.fetchCollection(1);
 */
Bangumi.prototype.fetchCollection = function(subject_id, params, callback){
  var url =  '/collection/' + subject_id;
  return this.get(url, params, callback);
};

/**
 * A POST method that updates user's status on specific subject by subject id
 * @param subject_id {integer} id of target subject
 * @param [params] {object}
 * @param [params.status=wish] {string} accept [wish|collect|do|on_hold|dropped]
 * @param [params.comment] {string} comment on target subject status update
 * @param [params.tags] {string} tags on target subject status update, separated by comma
 * @param [params.rating] {integer} star rating on target subject, accept [0~10]
 * @param [params.privacy] {integer} privacy control of this action, accepts [0|1] (0.open, 1.private)
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @example
 * bgm.createCollection(211567, {status: 'do', rating: 10});
 */
Bangumi.prototype.createCollection = function(subject_id, params, callback){
  var url = '/collection/' + subject_id + '/update';
  return this.post(url, params, callback);
};

/**
 * A POST method that updates user's status on specific episode by episode id
 * @param ep_id {integer} id of target episode
 * @param status {string} accept [watched|queue|drop|remove]
 * @param [params] {object}
 * @param [params.ep_id] {string} a list of episode ids for batch processing, separated by comma
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @example
 * bgm.updateEpStatus(7036,'drop');
 */
Bangumi.prototype.updateEpStatus = function(ep_id, status, params, callback){
  var url = '/ep/' + ep_id + '/status/' + status;
  return this.post(url, params, callback);
};


/**
 * A POST method that marks episode 1 to target number as watched
 * @param subject_id {integer} id of target subject
 * @param params {object}
 * @param params.watched_eps {string} the number of episodes that user currently have watched
 * @param [params.watched_vols] {string} the number of episodes that user currently have watched
 * @param [callback] {function} callback function
 * @returns {Promise}
 * @example
 * bgm.updateWatchedEps(18462, {watched_eps: 10, watched_vols: 2});
 */
Bangumi.prototype.updateWatchedEps = function(subject_id, params, callback){
  var url = '/subject/' + subject_id + '/update/watched_eps';
  return this.post(url, params, callback);
};