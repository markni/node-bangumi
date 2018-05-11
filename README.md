An simple Node.js client library for [Bangumi](https://bgm.tv) [REST API](https://github.com/bangumi/api).

Installation
-----------------------
	npm install bangumi --save


Getting Started
-----------------------

### Setup API
	var Bangumi = require('bangumi');
	var bgm = new Bangumi({
        access_token: "fill in your access token here"
	});


### Examples of Usage

#### Set up custom promise library
    bgm.setPromiseProvider(require('bluebird'));

#### Using callback
	bgm.search('天元突破',{
		responseGroup:"small",
		max_results:2,
		start:1,
		type:2
	},function(err,data){
		console.log(JSON.stringify(data));
	});

#### Using promise
	bgm.search('天元突破',{
		responseGroup:"small",
		max_results:2,
		start:1,
		type:2
	}).then(function(data){
		console.log(JSON.stringify(data));
	});

### Changelog
See [Releases](https://github.com/markni/node-bangumi/releases/)

### Documentation
See [documentation site](http://markni.github.io/node-bangumi/) and [Bangumi API official docs]https://github.com/bangumi/api

