/**

	MongodbModel
	lujun
	https://github.com/jserme/node-mongoskin#quickstart


*/
var config = require('../config');
var WebStatus = require('./WebStatus');
var mongodb = require('mongodb');

var MongodbModel = module.exports = function(dbname, collection, dbserver, port ){
	this.collection = collection;
	this.dbserver = dbserver;
	this.port = port;
	//this.init();
};

MongodbModel.dbMap = {};

MongodbModel.prototype = {
	constructor:MongodbModel,
	mongodb:mongodb,
	dbname:config.dbname,
	/**  适合于有主从的服务器组
	init:function( callback ){
		
		var servers = [];
		var item = null;
		var dbname = this.dbname;
		console.log( "db.name", this, this.dbname );
		for(var i=0; i<config.dbs.length; i++){
			item = config.dbs[i];
			servers.push( new mongodb.Server( item.ip, item.port,  {auto_reconnect:true }) );
		}

		mongodbs = new mongodb.ReplSetServers( servers );
		db = new mongodb.Db( dbname, mongodbs ,  {auto_reconnect:true });
		db.open(function(err, db){

			console.log("open er", err)
			MongodbModel.dbMap[dbname] = db;
			callback && callback();
		});
	},
	*/
	empty:function(){},
	init:function( callback ){
		
		var servers = [];
		//var item = null;
		var dbname = this.dbname;
		console.log("mongodb init");
		db = new mongodb.Db( dbname, new mongodb.Server( config.dbs[0].ip, config.dbs[0].port ) ,  {auto_reconnect:true, w:1 });
		db.open(function(err, db){
			MongodbModel.dbMap[dbname] = db;
			callback && callback();
		});
	},
	objectId:function( id ){
		try{
			return new mongodb.ObjectID( String(id) );
		}catch(e){
			console.log( "objectid function error  id:", id);
			return null;
		}
	},
	opendb:function( callback ){
		var self = this;
		if( !this.db ){
			this.db = MongodbModel.dbMap[this.dbname];
		}

		if( this.db ){
			callback( this.db.collection( this.collection ),{close:function(){}} );
		}else{
			this.init( function(){
				self.opendb( callback )
			})
		}

	},

	insert:function( json , callback ){
		this.opendb(function( collection, db ){
			collection.insert( json, function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result[0]) );
				}
				
			});
		});
	},

	find:function( selecter, callback ){

		this.opendb(function( collection, db ){
			collection.find( selecter ).toArray(function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result || []) );
				}
				
			});
		});

	},
	
	findOneFilter:function( selecter, filter, callback ){

		this.opendb(function( collection, db ){
			collection.findOne( selecter , filter ,function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});

	},

	findFilter:function( selecter, filter, callback ){

		this.opendb(function( collection, db ){
			collection.find( selecter, filter ).toArray(function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});

	},


	findLimit:function(selecter, limit, callback){
		this.opendb(function( collection, db ){
			collection.find( selecter ).limit( limit ).toArray(function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});
	},
	findSort:function(selecter, sorter, callback){

		this.opendb(function( collection, db ){
			collection.find( selecter ).sort( sorter ).toArray(function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});

	},
	findLimitSort:function(selecter, limiter, sorter, callback){
		this.opendb(function( collection, db ){
			collection.find( selecter ).limit( limiter ).sort( sorter ).toArray(function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});
	},
	findLimitSkip:function(selecter, limiter, skip, callback){
		this.opendb(function( collection, db ){
			collection.find( selecter ).limit( limiter ).skip( skip ).toArray(function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});
	},
	findLimitSkipSort:function(selecter, limiter, skip, sort, callback){
		this.opendb(function( collection, db ){
			collection.find( selecter ).limit( limiter ).skip( skip ).sort( sort ).toArray(function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});
	},
	findOne:function( selecter ,callback){

		this.opendb(function( collection, db ){
			collection.findOne( selecter , function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else if(result){
					callback( new WebStatus().setResult(result) );
				}else{
					callback( new WebStatus("404") );	
				}
				
			});
		});

	},
	update:function( selecter, updater , callback){

		this.opendb(function( collection, db ){
			collection.update( selecter , {"$set":updater}, {multi:true}, function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});

	},
	updateOne:function(selecter, updater, callback){
		
		//console.log('updater:   ',updater);
		
		this.opendb(function( collection, db ){
			collection.update( selecter , {"$set":updater}, function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});
	},
	remove:function(selecter, callback){
		this.opendb(function( collection, db ){
			collection.remove( selecter , function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});
	},
	count:function( selecter,  callback){
		this.opendb(function( collection, db ){
			collection.count( selecter , function(err, result){
				if( err ){
					callback( new WebStatus("601") );
				}else{
					callback( new WebStatus().setResult(result) );
				}
				
			});
		});
	}

}