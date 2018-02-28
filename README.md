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

#### Search
	b.search('天元突破',{
		responseGroup:"small",
		max_results:2,
		start:1,
		type:2
	},function(err,data){
		console.log(JSON.stringify(data));
	});

### Documentation
    See [https://github.com/bangumi/api]