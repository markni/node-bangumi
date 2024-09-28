A simple Node.js client library for legacy [Bangumi](https://bgm.tv) [REST API](https://github.com/bangumi/api/blob/master/open-api/api.yml).

Installation
-----------------------

	npm install bangumi --save


Getting Started
-----------------------

### Setup API
	const Bangumi = require('bangumi');
	const bgm = new Bangumi({
        access_token: "fill in your access token here"
	});

### How to get and refresh access token

This library currently does not handle token requests or renew. Please follow [these steps](https://github.com/bangumi/api/blob/master/docs-raw/How-to-Auth.md) to get your valid token.

Once you get a new token, it can be replaced live with

```
bgm.setAccessToken(your_token);
```

### Examples of Usage

#### Set up custom promise library
    bgm.setPromiseProvider(require('bluebird'));

#### Using promise
	bgm.search('天元突破',{
		responseGroup: 'small',
		max_results:2,
		start:1,
		type:2
	}).then(data => console.log(JSON.stringify(data))).catch(console.error);


#### Using callback
	bgm.search('天元突破',{
		responseGroup: 'small',
		max_results:2,
		start:1,
		type:2
	},function(err, data){
		console.log(JSON.stringify(data));
	});

### Changelog
See [Releases](https://github.com/markni/node-bangumi/releases/)

### Documentation
See [documentation site](http://markni.github.io/node-bangumi/) and [Bangumi API official docs](https://github.com/bangumi/api)
