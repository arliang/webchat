
/**

	markdown

*/

var tool = require("./tools");

module.exports = {

	defaultPrefix : '```',

	format : function( text ){

		if( String(text).length < 1 ){

			return text;

		}

		var strarr = text.split(this.defaultPrefix);
		var markIndex = -1;
		var i = 0;
		for(;i<strarr.length; i++){

			if( markIndex == -1 ){
				markIndex = i;
				strarr[i] = tool.removeHtmlTag( strarr[i] );
				strarr[i] = this.lineFormat( strarr[i] );
				strarr[i] = this.urlFormat( strarr[i] );

			}else{

				strarr[markIndex+1] = "<pre>"+ strarr[markIndex+1];
				strarr[i] += "</pre>";
				markIndex = -1;
			}

		}

		return strarr.join("");
		
	},
	urlFormat : function( text ){
		return text.replace(/(http|https):\/\/[\w\.\/\:\?\&\=\#\-\_]+/gi, function( a ){
			return '<a href="'+a+'" target="_blank">'+a+'</a>'
		});
	},

	lineFormat : function( text ){
		return text.replace(/\n/gi, "<br/>");
	} 
}