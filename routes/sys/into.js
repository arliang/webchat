/**
	
	into
	
	登录
*/

module.exports = {

	get:null,
	post:function(req, res){
		var id = req.body.roomid;
		if(id){
			res.redirect("/"+id);
		}else{
			res.redirect("/");
		}
	}
	
};