
/**
	number:14
		�ı����ѵ�״̬��������ֻ������Ϊ 2 �Ѷ���
		
	url:"/sys/notice_status"
	method:"post",
	param:{
		_id: ,//��Ϣ_id
		[status]:2,//Ĭ��2
	}
	return :{
		code:0,
		msg:"",
		result:null
	}
*/

var NoticeModel = require("../../lib/NoticeModel");
var WebStatus = require("../../lib/WebStatus");

module.exports = function( req, res ){

	var user = req.session.user || null;
	var status = Number(req.body.status);
	var _id = req.body._id;

	status = isNaN(status) ? 2 : status;


	if( !user ){

		res.write( new WebStatus("-3").toString() );
		res.end();
		return ;
	}

	if( String(_id).length != 24 || !(status == 1 || status == 2 || status == 0)){

		res.write( new WebStatus("-1").toString() );
		res.end();

		return ;
	}


	NoticeModel.updateStatus( String(_id), status, function( status ){

		res.write( status.toString() );
		res.end();

	});
}