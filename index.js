var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var game_data = {
	'poker':{
		'slots' : 8,
		'tables' :{
			'number' : 6,
			'people' : 1,
		},
	},
	'blackjack':{
		'slots' : 8,
		'tables' :{
			'number' : 6,
			'people' : 1,
		},
	},
	'derby':{
		'slots' : 8,
		'tables' :{
			'number' : 4,
			'people' : 2,
		},
	},
	'roulette':{
		'slots' : 8,
		'tables' :{
			'number' : 1,
			'people' : 3,
		},
	},
};
var filled_slots = [
{
	'day':1,
	'game':[{
		'name': 'poker',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'blackjack',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'derby',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'roulette',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},]
},
{
	'day':2,
	'game':[{
		'name': 'poker',
		'slots':[{
			'slotno':0,
			'tables':[],
		},
		{
			'slotno':5,
			'tables':[2,3]
		}]
	},
	{
		'name': 'blackjack',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'derby',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'roulette',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},]
},
{
	'day':3,
	'game':[{
		'name': 'poker',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'blackjack',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'derby',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'roulette',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},]
},
{
	'day':4,
	'game':[{
		'name': 'poker',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'blackjack',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'derby',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},
	{
		'name': 'roulette',
		'slots':[{
			'slotno':0,
			'tables':[],
		}]
	},]
},
];
var CURR_DAY = 1;
http.listen(8000,function(){
	console.log('Server listening on Port 8000');
});
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'iamthebest111',
	database:'mi_casino',
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});

app.get('/java.js',function(req,res){
	res.sendFile(__dirname+'/java.js');
});

app.get('/next_page', function(req,res){
	res.sendFile(__dirname+'/secondpage.html');
});

app.get('/jquery',function(req,res){
	res.sendFile(__dirname+'/jquery-1.11.3.min.js');
});

app.post('/new_reg', function(req,res){
	console.log(req.body);
	var mino = req.body.mino;
	var game = {};
	var data = {};
	game.game = req.body.game;
	game.data = game_data[game.game];
	var query = 'SELECT * from '+game.game+' WHERE mi_no = "'+mino+'"';
	connection.query(query,function(err,rows,fields){
		if(!!err)
		{
			console.log(err);
			data.error = err;
			data.status = false;
		}
		else if(rows.length!=0)
		{
			console.log(rows);
			data.status = false;
			data.data = rows;
			data.game = game;
		}
		else if(rows.length == 0)
		{
			data.status = true;
			data.data = {};
			data.data.mi_no = mino;
			data.game = game;
		}
		res.json(data);
	});
});

app.post('/check_fill',function(req,res){
	var slotno = req.body.slotno;
	console.log('around here');
	console.log(slotno);
	var game = req.body.game;
	for (var i = 0; i < filled_slots[CURR_DAY-1].game.length; i++) {
		if(filled_slots[CURR_DAY-1].game[i].name == game)
		{
			var curr_game = filled_slots[CURR_DAY-1].game[i];
			break;
		}
	};
	var data = {
		'tables':[],
	};
	data.total = game_data[game].tables.number;
	data.slot_no = slotno;
	for (var i = 0; i < curr_game.slots.length; i++) {
		if(curr_game.slots[i].slotno == slotno)
		{
			var curr_slot = curr_game.slots[i];
			for (var j = 0; j < curr_slot.tables.length; j++) {
				data.tables.push(curr_slot.tables[j]);
			}
		}
	}
	res.json(data);
});

app.post('/add_entry',function(req,res){
	var data = req.body;
	console.log(data);
	var send_data = {};
	var query = 'INSERT INTO '+data.game+' VALUES ("'+data.mino+'",'+data.slotno+','+data.tableno;
	if (data.game == 'poker') 
	{	
		query+=',"'+data.phoneno+'",'+data.exp;
	}
	query+=','+CURR_DAY+')';
	console.log(query);
	connection.query(query,function(err,rows,fields){
		if(!!err)
		{
			send_data.error = err;
			send_data.msg = 'Error adding user. Please try again.';
		}
		else
		{
			send_data.error = 0;
			send_data.msg = 'User Added Successfully';
		}
	});
	query = 'SELECT * from '+data.game+' WHERE table_no='+data.tableno+' AND slot_no='+data.slotno;
	console.log(query);	
	connection.query(query,function(err,rows,fields){
		if(!!err)
		{
			console.log(err);
		}
		else
		{
			console.log('row='+rows.length);
			console.log(game_data[data.game].tables.people);
			if(rows.length == game_data[data.game].tables.people)
			{
				console.log('hi i got here');
				for (var i = 0; i < filled_slots[CURR_DAY-1].game.length; i++) {
					if(filled_slots[CURR_DAY-1].game[i].name == data.game)
					{
						var curr_game = filled_slots[CURR_DAY-1].game[i];
						break;
					}
				};
				var slot_flag = 0;
				var slot_pos = 0;
				for (var i = 0; i < curr_game.slots.length; i++) {
					if(curr_game.slots[i].slotno == data.slotno)
					{
						console.log('now here');
						slot_flag = 1;
						slot_pos = i;
						break;
					}
				};
				if (slot_flag!=0) 
				{
					curr_game.slots[slot_pos].tables.push(data.tableno);
				}
				else
				{
					var new_data = {
						'slotno':0,
						'tables':[],
					}
					new_data.slotno = data.slotno;
					new_data.tables.push(data.tableno);
					console.log(new_data);
					curr_game.slots.push(new_data);
				}
			}
		}
		res.json(send_data);
	});
});

