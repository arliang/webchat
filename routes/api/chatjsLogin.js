/**
	number:18
		chat.js��¼�ӿ�
    uidΪ��
        ����uid�˻����´ο�ʹ��uid��¼
    uid��ֵ
        ��ѯuid�Ƿ�ע�ᣬ���Ѿ�ע��ֱ�ӵ�¼���˻�
        δע��ʹ��uid�����˻�


	url:"/sys/vchat-login"
	method:"post",
	param:{
		domain: //��ѡ
		uid:"�Զ�����һ��24λMD5ֵ" //��ѡ
		uname: "����"//��ѡ
		uavatar: ""//��ѡ
	}

	return {
		code:0,
		msg:"",
		result:{
			user:User,
			multiple:User, //�������Ѿ��������û�
			roomid:13623984732, //server��Ӧ��roomid,
			isNew:[0,1]// 0���˻�  1���˻�
		}
	}
*/

var Promise = require('../../lib/Promise');
var WebStatus = require('../../lib/WebStatus');
var Room = require('../../lib/Room');
var RoomModel = require('../../lib/RoomModel');
var ChatModel = require('../../lib/ChatModel');

module.exports = function( req, res ){
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader("Access-Control-Allow-Origin", req.headers.origin);

	var user = req.session.user;
	var domain = req.body.domain;
	var topic = req.body.topic;
	var des = req.body.des;
	var haxid = null;

	if( !user ){
		res.end( new WebStatus("304").setMsg("not login") );
		return ;
	}

	if( !domain ){
		res.end( new WebStatus("-1").setMsg("Miss 'domain'") );
		return ;
	}

	haxid = Room.toHex( domain );

	var promise = new Promise();

	promise.add(function(){
		RoomModel.idFind(haxid, function( status ){

			promise.ok( status );

		});
	});

	promise.then(function( status ){

		if( status.code == "0" ){
			promise.ok( status );
		}else{

			var room = new Room(topic || domain, des || domain, user._id);
			room.setdomain( domain );
			RoomModel.insert(room.toJSON(), function( status ){
				promise.ok( status );
				if(status.code == "0"){
					ChatModel.create( status.result.id, "Your first message!", "*", user._id, null);
				}
			});
		}
	});

	promise.then(function( status ){

		res.end( status.toString() );
	});	

	promise.start();

}