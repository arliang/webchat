/*扩展 WE.kit.textarea */

WE.extend(WE.kit, {
	cache:{},
	tmpl : function(str, data){
		var fn = !/\W/.test(str) ?
		  cache[str] = cache[str] ||
			tmpl(document.getElementById(str).innerHTML) :
		  
		  new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
			"with(obj){p.push('" +
			
			str
			  .replace(/[\r\t\n]/g, " ")
			  .split("<%").join("\t")
			  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
			  .replace(/\t=(.*?)%>/g, "',$1,'")
			  .split("\t").join("');")
			  .split("%>").join("p.push('")
			  .split("\r").join("\\'")
		  + "');}return p.join('');");
		  
		return data ? fn( data ) : fn;
	},
	pad:function(string, length, pad){
		var len = length - String(string).length
		if(len < 0){
			return string;
		}
		var arr = new Array( length - String(string).length || 0 )
		arr.push(string); 
		return arr.join(pad || '0');
	},
	format : function(source, pattern){// date format
		// Jun.com.format(new Date(),"yyyy-MM-dd hh:mm:ss");
		//Jun.com.format(new Date(),"yyyy年MM月dd日 hh时:mm分:ss秒");
		source = new Date(source);
		var pad = this.pad,
			date = {
			yy		: String(source.getFullYear()).slice(-2),
			yyyy	: source.getFullYear(),
			M		: source.getMonth() + 1,
			MM		: pad(source.getMonth()+1, 2, '0'),
			d		: source.getDate(),
			dd		: pad(source.getDate(), 2, '0'),
			h		: source.getHours(),
			hh		: pad(source.getHours(), 2, '0'),
			m		: source.getMinutes(),
			mm		: pad(source.getMinutes(), 2, '0'),
			s		: source.getSeconds(),
			ss		: pad(source.getSeconds(), 2, '0')
			};
		return (pattern || "yyyy-MM-dd hh:mm:ss").replace(/yyyy|yy|MM|M|dd|d|hh|h|mm|m|ss|s/g, function(v){ return date[v];});
			
	},
	weFormat : function( time ){

		var output = '';
		var date = new Date( time );
		var now = new Date();

		var nYear = now.getFullYear(),
			nMonth = now.getMonth() + 1,
			nDate = now.getDate();

		var gYear = date.getFullYear(),
			gMonth = date.getMonth() + 1,
			gDate = date.getDate();

		var dateArr = [gYear, gMonth, gDate];
		var timeArr = [date.getHours(), date.getMinutes(), date.getSeconds()];

		if( gYear == nYear  ){

			if( gMonth == nMonth ){

				if( gDate == nDate ){

					output = 'Today' + ' ' + timeArr.join(':');
				}else if( (gDate - nDate) == 1 ){

					output = 'Yesterday' + ' ' + timeArr.join(':');
				}else{

					output = dateArr.splice(1,3).join('-') + ' ' + timeArr.join(':');
				}

			}else if( gMonth != nMonth ){

				output = dateArr.splice(1,3).join('-') + ' ' + timeArr.join(':');
			}
			
		}else{

			output = dateArr.join('-') + ' ' + timeArr.join(':');
		}

		return output;
	},
	sortFormat:function(source){
		return this.format(source, "yyyy-MM-dd");
	},
	longFormat:function(source){
		return this.format(source, "yyyy-MM-dd hh:mm:ss");
	},
	//获取一个模板
	getTmpl:function(file, callback){

		var _this = this ;

		if(_this.cache[file]){

			callback && callback( _this.cache[file] );
			return ;
		}

		$.ajax({
			url:"/api/tmpl",
			medthod:"get",
			data:{path: file},
			success:function( data ){
				_this.cache[file] = data;
				callback && callback( data );
				//console.log( data );
			}
		})

	},
	cutOff:function( text, length ){

		if( text.length > length ){
			return text.slice(0, length)+"...";
		}

		return text;
	},

	/**
	 * 获取radio的值
	 * @param {string} name : input的name属性
	 */
	getRadioValue : function( name ){
		return $('input[type=radio][name='+name+']:checked').val();
	},


	/**
		规则
		 <1分钟	60*1000 刚刚
		 <5分钟	5* 1000 * 60 5分钟
		 <10分钟 10 * 1000 * 60 10分钟
		 <30分钟 30 * 1000 * 60  30分钟
		 <1小时  60 * 1000 * 60  1小时
		 <2小时  2* 60 * 1000 * 60 2小时
		 <5小时  5 * 60 * 1000 * 60 5小时
		 <24小时 24 * 60 * 1000 * 60 1天前
		 <48小时 2* 24 * 60 * 1000 * 60 2天前

	*/
	weTime:(function( ){

		var times = [
			{t:60*1000, s:"刚刚"},
			{t:2*60*1000, s:"1分钟"},
			{t:3*60*1000, s:"2分钟"},
			{t:6*60*1000, s:"5分钟"},
			{t:11*60*1000, s:"10分钟"},
			{t:30*60*1000, s:"30分钟"},
			{t:60*60*1000, s:"1小时"},
			{t:2*60*60*1000, s:"2小时"},
			{t:5*60*60*1000, s:"5小时"},
			{t:24*60*60*1000, s:"1天前"},
			{t:2*24*60*60*1000, s:"2天前"}
		];
		return function( time ){
			var t = new Date().getTime();
			var ct = t - time;
			var i = 0;
			while( i < times.length ){
				if( times[i++].t > ct ){
					return times[i-1].s;
				}
			}

			return WE.kit.format( time , "MM-dd hh:mm:ss");
		}

	})(),
	getAvatar:function(hex, size, d){
		hex = hex || "00000000000000000000000000000000";
		size = size || 48;
		d = d || "mm";
		return "http://www.gravatar.com/avatar/"+hex+"?s="+size+"&d="+d;
	},
	chatFormate:function( text ){

		return text.replace(/\n/gi, "<br/>").replace(/http:\/\/[\w\.\/\:\?\&\=\#\-\_]+/gi, function( a ){
			return '<a href="'+a+'" target="_blank">'+a+'</a>'
		})

	},
	removeHtmlTag:function(a){return a.replace(/<|>/g,function(a){return a=="<"?"&lt;":"&gt;"})},
	revertHtmlTag:function( text ){

		return text.replace(/\n/gi, "<br/>").replace(/http:\/\/[\w\.\/\:\?\&\=\#\-\_]+/gi, function( a ){
			return '<a href="'+a+'" target="_blank">'+a+'</a>'
		})

	},
	getHidden:function(){
		var hidden;
		if( typeof document.hidden !== "undefined" ){
			hidden = "hidden";
		}else if( typeof document.mozHidden !== "undefined" ){
			hidden = "mozHidden";
		}else if( typeof document.msHidden !== "undefined" ){
			hidden = "msHidden";
		}else if( typeof document.webkitHidden !== "undefined" ){
			hidden = 'webkitHidden';
		}
		return document[hidden];
	},
	titleRoll:function(title,speed){
		var titleArr = title.split(''),
			run = function(){
				titleArr.push(titleArr[0]);
				titleArr.shift();
				document.title = titleArr.join('');
			};

		setInterval(run,speed);
	}
});
	