/**

	WebError

	描述错误，也作为任何 callback 的返回对象
*/


exports = module.exports = WebStatus;

var STATUS = {
	"0":"ok",
	"-1":"参数错误",	
	"-2":"信息重复",
	"-3":"未登录或登录超时",
	"500":"服务器错误",
	"600":"数据库错误",
	"601":"数据库错误",
	"403":"Client Access Licenses exceeded（超出客户访问许可证）",
	"404":"not defined"
};

function WebStatus( code ){

	this.init( code );
};
WebStatus.prototype.constructor = WebStatus;

WebStatus.prototype.init = function( code ){

	code = code === undefined ? 0 : code;
	this.code = code;
	this.result = null;
	this.msg = STATUS[code] || "未知错误定义，code:"+code;

};


WebStatus.prototype.setCode = function( code  ) { 
	this.init( code );
	return this;
};

WebStatus.prototype.addMsg = function( msg ){

	this.msg += msg;
	return this;
};

WebStatus.prototype.setMsg = function( msg ){

	this.msg = msg;
	return this;
},
WebStatus.prototype.setResult = function( object ){

	this.result = object;
	return this;
};

WebStatus.prototype.toJSON = function( add ){
	
	var json = {
		code : this.code,
		msg: this.msg,
		result:this.result
	};
    if( add ){
        for(var key in add){
            json[key] = add[ key ];
        }
    }
	return json;
};
WebStatus.prototype.toString = function(){
	return JSON.stringify( this.toJSON() );
};


