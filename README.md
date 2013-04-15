Installation
-----------------------
	npm install bangumi


Getting Started
-----------------------

### Setup API
	var Bangumi = require('bangumi');
	var bgm = new Bangumi({
        app_id: "fill in your app id here"
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

