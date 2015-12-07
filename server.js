var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongodbURL = 'mongodb://restmongo:A3y0t7s2CabIvo2FwEpaY0LUsSQw1JAGoGJeG7AOUBg-@ds052968.mongolab.com:52968/restmongo';
var mongoose = require('mongoose');

app.post('/',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		if(req.body.building != undefined||req.body.street != undefined||req.body.zipcode != undefined){
		rObj.address = {};
		if(req.body.building != undefined) rObj.address.building = req.body.building;
		if(req.body.street != undefined) rObj.address.street = req.body.street;
		if(req.body.zipcode != undefined) rObj.address.zipcode = req.body.zipcode;
		}
		if(req.body.lon != undefined||req.body.lat != undefined){
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		}
		if(req.body.borough != undefined) rObj.borough = req.body.borough;
		if(req.body.cuisine != undefined) rObj.cuisine = req.body.cuisine;
		if(req.body.name != undefined) rObj.name = req.body.name;
		if(req.body.restaurant_id != undefined) rObj.restaurant_id = req.body.restaurant_id;

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		//console.log(r);
		r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant created!')
       		db.close();
			res.status(200).json({message: 'insert done', _id: r._id});
    	});
    });
});

app.delete('/restaurant_id/:id',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done', restaurant_id: req.params.id});
    	});
    });
});

app.delete('/restaurant_id/:id/grade/:gid',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.update({restaurant_id: req.params.id},{$pull:{grades:{_id:req.params.gid}}},{ safe: true },function(err){
			if (err) {
				res.status(500).json(err);
				throw err
			}else{
				res.status(200).json({message: 'delete done'});
			}
			db.close();
		});
    });
});

app.delete('/restaurant/:criteria_attrib/:criteria_attrib_value',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		if(req.params.criteria_attrib=='building'||req.params.criteria_attrib=='street'||req.params.criteria_attrib=='zipcode'||req.params.criteria_attrib=='coord'){
			if(req.params.criteria_attrib=='coord'){
				criteria['address.'+req.params.criteria_attrib] = JSON.parse("[" + req.params.criteria_attrib_value+ "]");
			}else{
				criteria['address.'+req.params.criteria_attrib] = req.params.criteria_attrib_value;
			}
		}else{
			criteria[req.params.criteria_attrib] = req.params.criteria_attrib_value;
		}
		Restaurant.find(criteria).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			var message = {};
			message.message = 'delete done';
			message[req.params.criteria_attrib] = req.params.criteria_attrib_value;
			res.status(200).json(message);
    	});
    });
});

app.delete('/restaurant/coord/:lon/:lat',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		criteria['address.coord'] = []
		criteria['address.coord'].push(req.params.lon);
		criteria['address.coord'].push(req.params.lat);
		Restaurant.find(criteria).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			var message = {};
			message.message = 'delete done';
			message[req.params.criteria_attrib] = req.params.criteria_attrib_value;
			res.status(200).json(message);
    	});
    });
});

app.get('/restaurant/or/:attrib1/:value1/:attrib2/:value2', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		if(req.params.attrib1=='building'||req.params.attrib1=='street'||req.params.attrib1=='zipcode'||req.params.attrib1=='coord'){
			if(req.params.attrib1=='coord'){
				criteria['address.'+req.params.attrib1] = JSON.parse("[" + req.params.value1+ "]");
			}else{
				criteria['address.'+req.params.attrib1] = req.params.value1;
			}
		}else{
			criteria[req.params.attrib1] = req.params.value1;
		}
		var criteria2 = {};
		if(req.params.attrib2=='building'||req.params.attrib2=='street'||req.params.attrib2=='zipcode'||req.params.attrib2=='coord'){
			if(req.params.attrib2=='coord'){
				criteria2['address.'+req.params.attrib2] = JSON.parse("[" + req.params.value2+ "]");
			}else{
				criteria2['address.'+req.params.attrib2] = req.params.value2;
			}
		}else{
			criteria2[req.params.attrib2] = req.params.value2;
		}
		Restaurant.find({$or:[criteria,criteria2]}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			var message = {};
			message.message = 'delete done';
			message.or = {};
			message.or[req.params.attrib1] = req.params.value1;
			message.or[req.params.attrib2] = req.params.value2;
			res.status(200).json(message);
    	});
    });
});

app.get('/restaurant/and/:attrib1/:value1/:attrib2/:value2', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		if(req.params.attrib1=='building'||req.params.attrib1=='street'||req.params.attrib1=='zipcode'||req.params.attrib1=='coord'){
			if(req.params.attrib1=='coord'){
				criteria['address.'+req.params.attrib1] = JSON.parse("[" + req.params.value1+ "]");
			}else{
				criteria['address.'+req.params.attrib1] = req.params.value1;
			}
		}else{
			criteria[req.params.attrib1] = req.params.value1;
		}
		if(req.params.attrib2=='building'||req.params.attrib2=='street'||req.params.attrib2=='zipcode'||req.params.attrib2=='coord'){
			if(req.params.attrib2=='coord'){
				criteria['address.'+req.params.attrib2] = JSON.parse("[" + req.params.value2+ "]");
			}else{
				criteria['address.'+req.params.attrib2] = req.params.value2;
			}
		}else{
			criteria[req.params.attrib2] = req.params.value2;
		}
		Restaurant.find(criteria).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			var message = {};
			message.message = 'delete done';
			message.and = {};
			message.and[req.params.attrib1] = req.params.value1;
			message.and[req.params.attrib2] = req.params.value2;
			res.status(200).json(message);
    	});
    });
});

app.get('/restaurant_id/:id', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id},function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document',restaurant_id:req.params.id});
			}
			db.close();
    	});
    });
});

app.get('/restaurant_id/:id/avgscore', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.aggregate([
		 {$match: {restaurant_id: req.params.id}},
		 {$unwind: "$grades"},
		 {$group: {_id: "$restaurant_id", avg_score: {$avg:
		"$grades.score"}}}
		],function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document',restaurant_id:req.params.id});
			}
			db.close();
    	});
    });
});

app.get('/restaurant_id/:id/avgscore/lt/:score', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.aggregate([
		 {$match: {restaurant_id: req.params.id}},
		 {$unwind: "$grades"},
		 {$group: {_id: "$restaurant_id", avg_score: {$avg:
		"$grades.score"}}},
		{$elemMatch:{avg_scroe:$lt:{req.params.score}}}
		],function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document',restaurant_id:req.params.id});
			}
			db.close();
    	});
    });
});

app.get('/restaurant', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({},function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No document'});
			}
			db.close();
    	});
    });
});

app.get('/restaurant/:criteria_attrib/:criteria_attrib_value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		if(req.params.criteria_attrib=='building'||req.params.criteria_attrib=='street'||req.params.criteria_attrib=='zipcode'||req.params.criteria_attrib=='coord'){
			if(req.params.criteria_attrib=='coord'){
				criteria['address.'+req.params.criteria_attrib] = JSON.parse("[" + req.params.criteria_attrib_value+ "]");
			}else{
				criteria['address.'+req.params.criteria_attrib] = req.params.criteria_attrib_value;
			}
		}else{
			criteria[req.params.criteria_attrib] = req.params.criteria_attrib_value;
		}
		
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				var message = {};
				message.message = 'No matching document';
				message[req.params.criteria_attrib] = req.params.criteria_attrib_value;
				res.status(200).json(message);
			}
			db.close();
    	});
    });
});

app.get('/restaurant/or/:attrib1/:value1/:attrib2/:value2', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		if(req.params.attrib1=='building'||req.params.attrib1=='street'||req.params.attrib1=='zipcode'||req.params.attrib1=='coord'){
			if(req.params.attrib1=='coord'){
				criteria['address.'+req.params.attrib1] = JSON.parse("[" + req.params.value1+ "]");
			}else{
				criteria['address.'+req.params.attrib1] = req.params.value1;
			}
		}else{
			criteria[req.params.attrib1] = req.params.value1;
		}
		var criteria2 = {};
		if(req.params.attrib2=='building'||req.params.attrib2=='street'||req.params.attrib2=='zipcode'||req.params.attrib2=='coord'){
			if(req.params.attrib2=='coord'){
				criteria2['address.'+req.params.attrib2] = JSON.parse("[" + req.params.value2+ "]");
			}else{
				criteria2['address.'+req.params.attrib2] = req.params.value2;
			}
		}else{
			criteria2[req.params.attrib2] = req.params.value2;
		}
		
		Restaurant.find({$or:[criteria,criteria2]},function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				var message = {};
				message.message = 'No matching document';
				message.or = {};
				message.or[req.params.attrib1] = req.params.value1;
				message.or[req.params.attrib2] = req.params.value2;
				res.status(200).json(message);
			}
			db.close();
    	});
    });
});

app.get('/restaurant/and/:attrib1/:value1/:attrib2/:value2', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		if(req.params.attrib1=='building'||req.params.attrib1=='street'||req.params.attrib1=='zipcode'||req.params.attrib1=='coord'){
			if(req.params.attrib1=='coord'){
				criteria['address.'+req.params.attrib1] = JSON.parse("[" + req.params.value1+ "]");
			}else{
				criteria['address.'+req.params.attrib1] = req.params.value1;
			}
		}else{
			criteria[req.params.attrib1] = req.params.value1;
		}
		if(req.params.attrib2=='building'||req.params.attrib2=='street'||req.params.attrib2=='zipcode'||req.params.attrib2=='coord'){
			if(req.params.attrib2=='coord'){
				criteria['address.'+req.params.attrib2] = JSON.parse("[" + req.params.value2+ "]");
			}else{
				criteria['address.'+req.params.attrib2] = req.params.value2;
			}
		}else{
			criteria[req.params.attrib2] = req.params.value2;
		}
		
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				var message = {};
				message.message = 'No matching document';
				message.and = {};
				message.and[req.params.attrib1] = req.params.value1;
				message.and[req.params.attrib2] = req.params.value2;
				res.status(200).json(message);
			}
			db.close();
    	});
    });
});

app.get('/restaurant/coord/:lon/:lat', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var criteria = {};
		criteria['address.coord'] = []
		criteria['address.coord'].push(req.params.lon);
		criteria['address.coord'].push(req.params.lat);
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				var message = {};
				message.message = 'No matching document';
				message['lon'] = req.params.lon;
				message['lat'] = req.params.lat;
				res.status(200).json(message);
			}
			db.close();
    	});
    });
});

app.put('/restaurant_id/:id/grade',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var rObj = {};
		rObj.date = req.body.date;
		rObj.grade = req.body.grade;
		rObj.score = req.body.score;
		Restaurant.update({restaurant_id: req.params.id},{$push:{grades:rObj}},function(err){
			if (err) {
				res.status(500).json(err);
				throw err
			}else{
				res.status(200).json({message: 'update done'});
			}
			db.close();
		});
    });
});

app.put('/restaurant_id/:id',function(req,res) {
	//console.log(req.query.Key);
	//console.log(req.body);
	/*
		for(var key in req.params) {
		  if(req.params.hasOwnProperty(key)){
			console.log(key +"is " + req.params[key])
		  }
		}
		for(var key in req.body) {
		  if(req.body.hasOwnProperty(key)){
			console.log(key +"is " + req.body[key])
		  }
		}
		for(var key in req.body) {
		  if(req.body.hasOwnProperty(key)){
			if(req.body[key] != undefined){
				rObj[key] = req.body[key];
			}
			//console.log(key +"is " + req.body[key])
		  }
		}
	*/
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var rObj = {};
		if(req.body.building != undefined){
			rObj['address.building'] = req.body.building;
		}
		if(req.body.street != undefined){
			rObj['address.street'] = req.body.street;
		}
		if(req.body.zipcode != undefined){
			rObj['address.zipcode'] = req.body.zipcode;
		}
		if(req.body.lon != undefined & req.body.lat != undefined ){
			rObj['address.coord'] = [];
			rObj['address.coord'].push(req.body.lon);
			rObj['address.coord'].push(req.body.lat);
		}
		if(req.body.coord != undefined){
			rObj['address.coord'] = JSON.parse("[" + req.body.coord + "]");
		}
		if(req.body.borough != undefined){
			rObj.borough = req.body.borough;
		}
		if(req.body.cuisine != undefined){
			rObj.cuisine = req.body.cuisine;
		}
		if(req.body.name != undefined){
			rObj.name = req.body.name;
		}
		if(req.body.restaurant_id != undefined){
			rObj.restaurant_id = req.body.restaurant_id;
		}
		//console.log(rObj);
		Restaurant.update({restaurant_id: req.params.id},{$set:rObj},function(err){
			if (err) {
				res.status(500).json(err);
				throw err
			}else{
				res.status(200).json({message: 'update done'});
			}
			db.close();
		});
    });
});

app.put('/:criteria_attrib/:criteria_attrib_value/:set_attrib/:set_attrib_value',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		var criteria = {};
		if(req.params.criteria_attrib=='building'||req.params.criteria_attrib=='street'||req.params.criteria_attrib=='zipcode'||req.params.criteria_attrib=='coord'){
			if(req.params.criteria_attrib=='coord'){
				criteria['address.'+req.params.criteria_attrib] = JSON.parse("[" + req.params.criteria_attrib_value+ "]");
			}else{
				criteria['address.'+req.params.criteria_attrib] = req.params.criteria_attrib_value;
			}
		}else{
			criteria[req.params.criteria_attrib] = req.params.criteria_attrib_value;
		}
		var updateset = {};
		if(req.params.set_attrib=='building'||req.params.set_attrib=='street'||req.params.set_attrib=='zipcode'||req.params.set_attrib=='coord'){
			if(req.params.set_attrib=='coord'){
				updateset['address.'+req.params.set_attrib] = JSON.parse("[" + req.params.set_attrib_value+ "]");
			}else{
				updateset['address.'+req.params.set_attrib] = req.params.set_attrib_value;
			}
		}else{
			updateset[req.params.set_attrib] = req.params.set_attrib_value;
		}
		
		Restaurant.update(criteria,{$set:updateset}, {multi: true},function(err){
			if (err) {
				res.status(500).json(err);
				throw err
			}else{
				res.status(200).json({message: 'update done'});
			}
			db.close();
		});
    });
});

app.listen(process.env.PORT || 8099);
