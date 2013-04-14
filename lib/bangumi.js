/**
 * @project node-bangumi
 * @fileOverview Bangumi API client library for node.js.
 * @author <a href="mailto:ruocaled@gmail.com">Ruocaled</a>
 * @version 0.1.0
 */

/**
 * @module Bangumi
 */

var	VERSION = '0.1.0';
var http = require('http');
var querystring = require('querystring');

/**
 * provides utilities methods
 * @class utils
 */
function utils(){
	//empty constructor
}

/**
 * Helper method that combines two json objects
 * @method merge
 * @static
 * @param [defaults] {object} source object
 * @param [options] {object} target object
 */
utils.merge = function(defaults, options) {
	defaults = defaults || {};
	if (options && typeof options === 'object') {
		var keys = Object.keys(options);
		for (var i = 0, len = keys.length; i < len; i++) {
			var k = keys[i];
			if (options[k] !== undefined) defaults[k] = options[k];
		}
	}
	return defaults;
}

/**
 * @class Bangumi
 * @param [options] {object}
 * @param [options.app_id] {string} app id used for identify source
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
		rest_base : "api.bgm.tv",
		cookie_options: {},
		cookie_secret: null
	};
	this.options = utils.merge(defaults, options);
}

Bangumi.VERSION = VERSION;
module.exports = Bangumi;


/**
 * A general GET reqeust method for Bangumi API
 * @method get
 * @param url {string} base GET request path
 * @param params {object} parameters used for GET query string
 * @param callback {function} callback function
 */
Bangumi.prototype.get = function(url, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}


	if ( typeof callback !== 'function' ) {
		throw "FAIL: INVALID CALLBACK.";
		return this;
	}

	if (url.charAt(0) !== '/')        {
		throw "FAIL: INVALID URL.";
		return this;
	}

	params = utils.merge({source:this.options.app_id},params);


	var options = {
		host: this.options.rest_base,
		path: url + '?' + querystring.stringify(params),
		method: 'GET',
		headers: this.options.headers
	};

	var req = http.request(options, function(res){
		var data = '';
		res.setEncoding('utf8');

		res.on('data', function (chunk) {
			data += chunk;
		});

		res.on('end', function () {
			try {
				var json = JSON.parse(data);
				callback(null,json);
			} catch(err) {
				console.log('problem with res: ' + err.message);
				callback(err,{});
			}
		});

		res.on('error', function(err) {
			console.log('problem with request: ' + err.message);
			callback(err,{});
		});
	});

	req.end();

	return this;
}


/**
 * A general POST reqeust method for Bangumi API
 * @method post
 * @param url {string} base POST request path
 * @param params {object} parameters used for POST body
 * @param callback {function} callback function
 */
Bangumi.prototype.post = function(url, params, callback) {
	if (typeof params === 'function') {
		callback = params;
		params = {};
	}

	if ( typeof callback !== 'function' ) {
		throw "FAIL: INVALID CALLBACK.";
		return this;
	}

	if (url.charAt(0) !== '/')        {
		throw "FAIL: INVALID URL.";
		return this;
	}

	var post_data =  querystring.stringify(params);

	var headers = utils.merge({'Content-Length': post_data.length},this.options.headers);

	var options = {
		host: this.options.rest_base,
		path: url + '?' + querystring.stringify({source:this.options.app_id}),
		method: 'POST',
		headers: headers
	};

	var req = http.request(options, function(res){
		var data = ''
		res.on('data', function (chunk) {
			data += chunk;
		});

		res.on('end', function () {
			try {
				var json = JSON.parse(data);
				callback(null,json);
			} catch(err) {
				console.log('problem with res: ' + err.message);
				callback(err,{});
			}
		});

		res.on('error', function(err) {
			console.log('problem with request: ' + err.message);
			callback(err,{});
		});
	});

	req.write(post_data);
	req.end();

	return this;
}


/**
 * A GET method that gets current weekly shows' seclude
 * @method calendar
 * @param callback {function} callback function
 */
Bangumi.prototype.calendar = function(callback) {
	var url = '/calendar';
	this.get(url,callback);
	return this;
}

/**
 * A GET method that gets target user's profile
 * @method user
 * @param username {string|integer} username or uid of target username
 * @param callback {function} callback function
 */
Bangumi.prototype.user = function(username,callback){
	var url = '/user/' + username;
	this.get(url,callback);
	return this;
}

/**
 * A GET method that gets a details of a subject by id
 * @method subject
 * @param subject_id {integer} id of target subject
 * @param params {object}
 * @param [params.responseGroup] {string} accept [small|medium|large]
 * @param callback {function} callback function
 */
Bangumi.prototype.subject = function(subject_id, params,callback){
	var url = '/subject/' + subject_id;
	this.get(url,params,callback);
	return this;
}

/**
 * A GET method that gets a list of episodes of a subject by subject id
 * @method ep
 * @param subject_id {integer} id of target subject
 * @param callback {function} callback function
 */

Bangumi.prototype.ep = function(subject_id,callback){
	var url = '/subject/' + subject_id + '/ep';
	this.get(url,callback);
	return this;
}

/**
 * A GET method that gets details of user's collection by user id
 * @method collectionByUser
 * @param username {string} username or uid of target username
 * @param params {object}
 * @param [params.cat] {string} accept [watching]
 * @param callback {function} callback function
 */
Bangumi.prototype.collectionByUser = function(username,params,callback){
	var url = '/user/' + username + '/collection';
	this.get(url,params,callback);
	return this;
}


/**
 * A GET method that searches and returns a list of subjects by keywords
 * @method search
 * @param keywords {string} query string for search
 * @param params {object}
 * @param [params.responseGroup] {string} accept [small|medium|large]
 * @param [params.type] {integer} accept [1|2|3|4|6] (1.book 2.anime 3.music 4.game 5.live action)
 * @param [params.start] {integer} result start index, used for paging
 * @param [params.max_results] {integer} the number of entries returns, max 20
 * @param callback {function} callback function
 */
Bangumi.prototype.search = function(keywords,params,callback){
	var url =  '/search/subject/' + keywords;
	this.get(url,params,callback);
	return this;
}



/**
 * A GET method that get current user's collection details on specific subject by subject id
 * @method collectionBySubject
 * @param subject_id {integer} id of target subject
 * @param params {object}
 * @param params.auth {string} authentication string used for validation of user identity
 * @param callback {function} callback function
 */
Bangumi.prototype.collectionBySubject = function(subject_id,params,callback){
	var url =  '/collection/' + subject_id;
	this.get(url,params,callback);
	return this;
}


/**
 * A GET method that get lists of episodes that user already watched, sorted by subject id
 * @method progress
 * @param username {string} username or uid of target username
 * @param params {object}
 * @param params.auth {string} authentication string used for validation of user identity
 * @param callback {function} callback function
 */
Bangumi.prototype.progress = function(username,params,callback){
	var url = '/user/' + username + '/progress';
	this.get(url,params,callback);
	return this;
}

/**
 * A POST method that login user with username and password, and returns auth string
 * @method auth
 * @param params {object}
 * @param params.username {string} username or uid of target username
 * @param params.password {string} password for target user
 * @param callback {function} callback function
 */

Bangumi.prototype.auth = function(params,callback){
	var url = '/auth';
	this.post(url,params,callback);
	return this;
}

/**
 * A POST method that updates user's status on specific subject by subject id
 * @method createCollection
 * @param subject_id {integer} id of target subject
 * @param params {object}
 * @param params.status {string} accept [wish|collect|do|on_hold|dropped]
 * @param [params.comment] {string} comment on target subject status update
 * @param [params.tags] {string} tags on target subject status update, separated by comma
 * @param [params.rating] {string} star rating on target subject, accept [0~10]
 * @param callback {function} callback function
 */
Bangumi.prototype.createCollection = function(subject_id,params,callback){
	var url = '/collection/' + subject_id + '/create';
	this.post(url,params,callback);
	return this;

}

/**
 * A POST method that updates user's status on specific episode by episode id
 * @method updateEp
 * @param ep_id {integer} id of target episode
 * @param status {string} accept [wish|collect|do|on_hold|dropped]
 * @param params {object}
 * @param [params.ep_id] {string} a list of episode ids for batch processing, separated by comma
 * @param callback {function} callback function
 */
Bangumi.prototype.updateEp = function(ep_id,status,params,callback){
	var url = '/ep/' + ep_id + '/status/' + status;
	this.post(url,params,callback);
	return this;
}


/**
 * A POST method that marks episode 1 to target number as watched
 * @method updateEps
 * @param subject_id {integer} id of target subject
 * @param params {object}
 * @param params.watched_eps {string} the number of episodes that user currently have watched
 * @param callback {function} callback function
 */
Bangumi.prototype.updateEps = function(subject_id,params,callback){
	var url = '/subject/' + subject_id + '/update/watched_eps'
	this.post(url,params,callback);
	return this;
}

