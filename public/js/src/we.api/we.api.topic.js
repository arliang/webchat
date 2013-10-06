/*
 * topic Api
 */
WE.api = WE.api || {};

WE.api.TopicModel = function(){

	this.createTopicUrl = '/sys/create';
}

WE.api.TopicModel.prototype = WE.BaseModel.prototype;

WE.api.TopicModel.prototype.create = function( topic, des, pwd ){
	this.post( this.createTopicUrl,{ topic:topic, des:des, pwd:pwd });
}