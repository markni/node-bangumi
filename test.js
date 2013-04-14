var Bangumi = require('./lib/bangumi');

var options = {
	app_id : "replacethis"
};

var b = new Bangumi(options);

var a = "replacethis";

b.auth({username:'nodebangumi',password:'node-bangumi'},function(err,data){
	console.log(data);
})

//b.calendar({},function(err,data){
//	console.log(data)
//});

//b.subject(290,{responseGroup:"medium",a:"a"},function(err,data){
//	console.log(data);
//})

//b.ep(290,{},function(err,data){
//	console.log(data);
//})

//b.collectionByUser('sai',{cat:"watching"},function(err,data){
//	console.log(data);
//})

//b.collectionBySubject(290,{auth:a},function(err,data){
//	console.log(data);
//});

//var p = {
//			responseGroup:"small",
//	        max_results:2,
//			start:1,
//			type:2
//		}
//b.search('天元突破',p,function(err,data){
//	console.log(err);
//	console.log(data);
//});



//b.createCollection(290,{auth:a,status:'do',comment:'好',tags:'fate',rating:5},function(err,data){
//	console.log(data);
//});

//b.progress('ruocaled',{auth:a},function(err,data){
//	console.log(JSON.stringify(data));
//});

//b.updateEp(3699,'watched',{ep_id:"3697,3698,3699",auth:a},function(err,data){
//	console.log(JSON.stringify(data));
//})

//b.updateEps(290,{watched_eps:11,auth:a},function(err,data){
//	console.log(JSON.stringify(data));
//})