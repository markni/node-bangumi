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

#### Callback
	bgm.search('天元突破',{
		responseGroup:"small",
		max_results:2,
		start:1,
		type:2
	},function(err,data){
		console.log(JSON.stringify(data));
	});

#### Promise
	bgm.search('天元突破',{
		responseGroup:"small",
		max_results:2,
		start:1,
		type:2
	}).then(function(data){
		console.log(JSON.stringify(data));
	});

### More Documentation
See https://github.com/bangumi/api for more details
