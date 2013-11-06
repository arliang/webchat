/**
	
	chat
	
	对话页面
*/

var tools = require("../../lib/tools");
var UserModel = require("../../lib/UserModel");
var WebStatus = require('../../lib/WebStatus');
var NoticeModel = require("../../lib/NoticeModel");


module.exports = {

		get:function(req, res){

			var user = req.session.user;
			var noticeStatus = req.query.status == "read" ? "read" : "unread";// read  unread
			var time = req.query.time || parseInt(Date.now()/1000) + 100;//时间推向未来10秒
			var output = {
				user:user ? user.getInfo() : null,
				status:noticeStatus,
				notices:[],
				time:time,
				tool:tools
			};

			var status = new WebStatus();

			if(!user){
				res.redirect('/login');
				return false;
			}


			NoticeModel.findNotice(user._id, time, noticeStatus == "read" ? [2]:[0,1] , 10, function( status ){
				if( status.code =="0" ){
					output.notices = status.result;
					//res.write(JSON.stringify( output,"", "  "));
					//res.end();
					res.render("user/notice", output);
				}else{
					res.render("error", status);
				}
			});		
		}
};