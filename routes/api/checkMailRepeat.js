
/**
	number:7
		��� mail �Ƿ��Ѿ�ע��
	
	url:"/sys/checkmail",
	method:get
	param:
		mail: //һ����ȷ��email
	return:{
		code:"0" //0, -2
		msg:"��ȷ"//δע�ᣬ�Ѿ�ע��
		result:null
	}
	
*/

var User = require("../../lib/User");
var WebStatus = require('../../lib/WebStatus');
var UserModel = require('../../lib/UserModel');

module.exports = function( req, res ){

	var mail  = req.query.mail;

	if( !User.checkMail( mail ) ){

		res.write( new WebStatus("-1").toString() );
		res.end();
		return ;

	}

	UserModel.emailFind( mail, function( status ){

		if(status.code == "404"){

			res.write( new WebStatus().toString() );
			res.end();
		}else{

			res.write( new WebStatus("-2").toString() );
			res.end();
		}

	} );

}