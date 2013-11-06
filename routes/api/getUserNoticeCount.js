/**
	url:"/sys/notice_count"
	method:"get"
	param:null,
	return :{
		code:0,(0, 301),
		msg:""//(����, δ��¼)
		result: 3//(δ����Ϣ����)
	}
*/
var WebStatus = require("../../lib/WebStatus");
var NoticeModel = require("../../lib/NoticeModel");


module.exports = function( req, res ){
	var user = req.session.user || null;
	var status = Number(req.query.status) || 0;

	if( !user ){

		res.write( new WebStatus("-3").toString() );
		res.end();
		return ;
	}

	NoticeModel.countStatus( String(user._id), [0], function( status ){

		res.write( status.toString() );
		res.end();

	});

}