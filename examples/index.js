//examples of how to use API

var Bangumi = require('../lib/bangumi');

var options = {
  access_token: 'replace this with access token getting from your app'
};
// var options = {
//   app_id : 'intouch'
// };
var b = new Bangumi(options);

var a = 'replacethiswithauthcode'; // for deprecated source api only

// b.auth({username:'nodebangumi@gmail.com',password:'node-bangumi'},function(err,data){
// 	console.log(JSON.stringify(data, null, '  '));
// })

// b.calendar(function(err,data){
// 	console.log(JSON.stringify(data, null, '  '));
// });

// b.user('sai', function(err, data){
//   console.log(JSON.stringify(data, null, '  '));
// });


// b.subject(290,{responseGroup:"medium",a:"a"},function(err,data){
// 	console.log(JSON.stringify(data, null, '  '));
// })

//b.ep(290,function(err,data){
//	console.log(JSON.stringify(data, null, '  '));
//})

//b.collectionByUser('sai',{cat:"watching"},function(err,data){
//	console.log(JSON.stringify(data, null, '  '));
//})

//b.collectionBySubject(290,{auth:a},function(err,data){
//	console.log(JSON.stringify(data, null, '  '));
//});

// var p = {
//   responseGroup: 'small',
//   max_results: 2,
//   start: 1,
//   type: 2
// };
// b.search('天元突破', {}, function (err, data) {
//   console.log(JSON.stringify(data, null, '  '));
// });


//b.createCollection(290,{auth:a,status:'do',comment:'好',tags:'fate',rating:5},function(err,data){
//	console.log(JSON.stringify(data, null, '  '));
//});

// b.progress('ruocaled', function(err, data){
//   console.log(JSON.stringify(data, null, '  '));
// });

//b.updateEp(3699,'watched',{ep_id:"3697,3698,3699",auth:a},function(err,data){
//	console.log(JSON.stringify(data, null, '  '));
//})

//b.updateEps(290,{watched_eps:11,auth:a},function(err,data){
//	console.log(JSON.stringify(data, null, '  '));
//})


// promise Example

// b.setPromiseProvider(require('bluebird'));

// b.user('sai').then(function(data){
//   console.log(JSON.stringify(data, null, '  '));
// }).finally(function(){
//   console.log('test')
// });
