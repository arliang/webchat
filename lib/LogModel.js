/**

	只记录用户日志

	LogModel

		提供对 user_log 集合的操作


*/
var WebStatus = require('./WebStatus');
var Log = require('./Log');
var MongodbModel = require('./MongodbModel');



function LogModel(){
	this.collection = "user_log";
};
//Object.create( events.EventEmitter )
LogModel.prototype = Object.create( MongodbModel.prototype );

LogModel.prototype.findLog = function( selecter, callback ){

	//this.findLimitSort( selecter, 100, {time:-1 }, callback);

	this.findLimitSort( selecter, 100, {time:-1}, callback );
}

LogModel.prototype.inquire = function( selecter, limit, callback){



	this.findLimitSort( selecter, limit, {time:-1}, function( status ){

		//var status = new WebStatus();
		if( status.code == "0" ){
			var data = status.result;	
			if( data && data.length ){
				var list = [];
				for(var i=0; i<data.length; i++){
					list.push( Log.factory(data[i]) );
				}
				status.setResult( list );
			}else{
				status.setCode("404");
			}
		}

		callback( status );


	});

};

LogModel.prototype.create = function( id, location, info, callback ){

	var log = new Log( id, location, info );

	this.insert( log, function( status ){

		status.setResult( Log.factory( status.result ) );
		callback && callback( status );

	});

	
};

LogModel.prototype.idFind = function( id, callback ){

	this.inquire( {id:id}, callback );

};

/**
	获取某个用户最近的活动记录

	return [log, log]
*/
LogModel.prototype.getLog = function( id, limit, callback ){
	limit = limit || 100;
	this.inquire({id:id}, limit, callback);
};

//读取一个房间历史的用户访问情况，不重复
LogModel.prototype.getHistory = function(roomid, limit, callback){

	this.inquire({"info.id":roomid}, 1000, function( status ){

		if(status.code == "0"){

			var map = {};
			var list = [];
			var result = status.result;
			var len = result.length;

			for(var i=0; i<len; i++){
				if( map[result[i].id] == undefined ){

					map[result[i].id] = true;
					list.push( result[i].id );
				}
				if( list.length >= limit ){
					break;
				}
			}

			status.setResult( list );
			callback( status )

		}else{

			callback( status )
		}

	});

};




exports = module.exports = new LogModel;

