var	VERSION = '0.1.0';
var http = require('http');
var querystring = require('querystring');

function merge(defaults, options) {
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
	this.options = merge(defaults, options);
}

Bangumi.VERSION = VERSION;
module.exports = Bangumi;

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

	params = merge({source:this.options.app_id},params);


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

	var headers = merge({'Content-Length': post_data.length},this.options.headers);

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



Bangumi.prototype.calendar = function(params, callback) {
	var url = '/calendar';
	this.get(url,params,callback);
	return this;
}


Bangumi.prototype.subject = function(subject_id, params,callback){
	var url = '/subject/' + subject_id;
	this.get(url,params,callback);
	return this;
}

Bangumi.prototype.ep = function(subject_id,params,callback){
	var url = '/subject/' + subject_id + '/ep';
	this.get(url,params,callback);
	return this;
}

Bangumi.prototype.collectionByUser = function(username,params,callback){
	var url = '/user/' + username + '/collection';
	this.get(url,params,callback);
	return this;
}

Bangumi.prototype.search = function(keywords,params,callback){
	var url =  '/search/subject/' + keywords;
	this.get(url,params,callback);
	return this;
}

//require auth
Bangumi.prototype.collectionBySubject = function(subject_id,params,callback){
	var url =  '/collection/' + subject_id;
	this.get(url,params,callback);
	return this;
}

//require auth
Bangumi.prototype.progress = function(username,params,callback){
	var url = '/user/' + username + '/progress';
	this.get(url,params,callback);
	return this;
}

Bangumi.prototype.auth = function(params,callback){
	var url = '/auth';
	this.post(url,params,callback);
	return this;
}

//require auth
Bangumi.prototype.createCollection = function(subject_id,params,callback){
	var url = '/collection/' + subject_id + '/create';
	this.post(url,params,callback);
	return this;

}

//require auth
Bangumi.prototype.updateEp = function(ep_id,status,params,callback){
	var url = '/ep/' + ep_id + '/status/' + status;
	this.post(url,params,callback);
	return this;
}

Bangumi.prototype.updateEps = function(subject_id,params,callback){
	var url = '/subject/' + subject_id + '/update/watched_eps'
	this.post(url,params,callback);
	return this;
}

