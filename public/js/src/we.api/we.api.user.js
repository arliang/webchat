/***

	 API


*/

WE.api = WE.api || {};

WE.api.UserModel = function(){

	this.bindMailURL = '/api/user-mail-set';
	this.setUserNameURL = "/api/user-name-update";
	this.updateAvatorURL = "/api/user-avatar-update";
	this.updateSummaryUrl = "/api/user-summary-update";
	this.contactUsersUrl = '/api/user-contact-get';

	this.verifMailUrl = '/api/user-mail-verify';
}

WE.api.UserModel.prototype = WE.BaseModel.prototype;

WE.api.UserModel.prototype.updateUserName = function( name ){

	//需求创建验证， 容易收到恶意攻击
	this.post(this.setUserNameURL, {name:name});
}

WE.api.UserModel.prototype.updateMail = function(mail, pwd){
	this.post(this.bindMailURL, {mail:mail, pwd:pwd});
}

WE.api.UserModel.prototype.updateAvator = function(gravatarDefault){
	this.post(this.updateAvatorURL,{gravatarDefault:gravatarDefault});
}

WE.api.UserModel.prototype.updateUserSummery = function( summery ){

	this.post(this.updateSummaryUrl,{summary:summery});
}

WE.api.UserModel.prototype.getContactList = function(){

	this.get(this.contactUsersUrl);
}

WE.api.UserModel.prototype.verifMail = function( mail ){

	this.get(this.verifMailUrl,{mail:mail});
}