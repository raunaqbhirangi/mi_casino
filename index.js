var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var session = require('client-sessions');

http.listen(8000,function(){
	console.log('Server listening on Port 8000');
});
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'iamthebest111',
	database:'mi_casino',
});

app.use(session({
	cookieName : 'session',
	secret : 'afwqewqsfwefda',
	duration : 5*60*1000,
	activeDuration : 2*60*1000,
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});

app.get('/java.js',function(req,res){
	res.sendFile(__dirname+'/java.js');
});

app.post('/new_reg', function(req,res){
	console.log(req.data);
})

