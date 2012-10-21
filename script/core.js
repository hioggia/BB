
// 超光速世界

(function(global,namespace){

	var SW = global[namespace] = {
		name: 'Superluminal World',
		version: '0.1',
		global: global,
		path: 'script/',
		debug: true,
		compiled: false
	};

	// 調試輸出
	SW.trace = function(){
		if(SW.debug){
			console.log.apply(console, Array.prototype.slice.call(arguments,0));
		}
	};

	SW.assert = function(){
		if(SW.debug && arguments[0] === false){
			console.error.apply(console, Array.prototype.slice.call(arguments,1));
		}
	};

	// 模塊加載
	(function(){

		var
			modules = {},
			callbacks = {},
			counter = 0,
			startModule = [];

		SW.define = function(url, factory){
			//define(url, function(require, exports, module){ });
			if( !SW.compiled && !(url in modules) ){
				throw '通過require請求的文件與define中定義的路徑不符， 請檢查： '+url;
			}

			modules[url] = {
				exports: {},
				factory: factory
			};

			if(typeof factory == 'function'){
				if( !SW.compiled ){
					var
						content = factory.toString(),
						regexp = /\brequire\b\s*\(\s*([\'\"])([\w\/\\-_]+)\1\s*\)/g;

					content.replace(regexp, function($1,$2,$3){
						load($3);
						return $1;
					});
				}
			}else{
				modules[url].exports = factory;
				delete modules[url].factory;
			}

			if(SW.compiled || --counter == 0){
				for(var url in callbacks){
					var
						callback = callbacks[url],
						exports = build(url);
					callbacks[url] = null;
					delete callbacks[url];
					callback(exports);
				}
				while(startModule.length > 0){
					SW.require(startModule.shift());
				}
			}
		};

		SW.require = function(url, callback){
			if(!modules[url]){
				if(typeof callback == 'function'){
					callbacks[url] = callback;
				}else{
					startModule.push(url);
				}
				load(url);
			}else{
				var exports = build(url);
				if(typeof callback == 'function'){
					callback(exports);
				}else{
					return exports;
				}
			}
		};

		function build(url){
			if('factory' in modules[url]){
				var exports = modules[url].factory(SW.require, modules[url].exports, modules[url]);
				if(exports){
					modules[url].exports = exports;
				}
				delete modules[url].factory;
			}
			return modules[url].exports;
		}

		function load(url){
			if(url in modules){
				return;
			}

			modules[url] = null;

			var
				script = document.createElement('script'),
				success = function(ev){
					if(ev.type != 'readystatechange' || script.readyState == 'loaded' || script.readyState == 'complete'){
						script.removeEventListener('load',success,false);
						script.removeEventListener('readystatechange',success,false);
						script.removeEventListener('error',failure,false);
					}
				},
				failure = function(){
					script.removeEventListener('load',success,false);
					script.removeEventListener('readystatechange',success,false);
					script.removeEventListener('error',failure,false);
					throw '加載腳本時發生錯誤： '+url;
				};
			counter++;
			script.addEventListener('load',success,false);
			script.addEventListener('readystatechange',success,false);
			script.addEventListener('error',failure,false);
			script.src = SW.path + url + '.js';
			document.body.appendChild(script);
		}

	})();

	// 原型派生
	(function(){

		SW.Class = function SuperluminalConstructor(){};

		SW.Class.extend = function( extras ){
			var
				proto = this,
				protoInst = new proto,
				extender = arguments.callee,
				property = {};

			function SuperluminalConstructor(){

				for(var key in property){
					if(typeof property[key] == 'object'){
						this[key] = copy(property[key]);
					}else{
						this[key] = property[key];
					}
				}

				if(arguments.callee.caller != extender && typeof this.init == 'function'){
					this.init.apply(this,Array.prototype.slice.call(arguments,0));
				}

			};

			for(var key in protoInst){

				if(typeof protoInst[key] == 'function'){
					SuperluminalConstructor.prototype[key] = protoInst[key];
				}else{
					property[key] = protoInst[key];
				}

			}

			for(var key in extras){

				if(typeof extras[key] == 'function'){
					SuperluminalConstructor.prototype[key] = extras[key];
				}else{
					property[key] = extras[key];
				}

			}

			SuperluminalConstructor.prototype.parent = function( method ){
				var
					deep = this.__proto__.constructor.__proto__,
					tmp = null,
					result = undefined;
				while(typeof deep.constructor != 'function'){
					if(method in deep){
						tmp = deep[method];
						delete deep[method];
						break;
					}
					deep = deep.constructor.__proto__;
				}
				result = tmp.apply( this, Array.prototype.slice.call(arguments, 1) );
				deep[method] = tmp;
				tmp = null;
				return result;
			}

			SuperluminalConstructor.prototype.constructor = new proto;

			SuperluminalConstructor.extend = extender;

			return SuperluminalConstructor;
		};

		function copy(object){
			var copied = {};

			if( object == null ){
				copied = null;
			}else if( object instanceof Array ){
				copied = [];
				for(var i=0, len=object.length; i<len; i++){
					if(typeof object[i] == 'object'){
						copied.push( copy(object[i]) );
					}else{
						copied.push(object[i]);
					}
				}
			}else{
				for(var key in object){
					if(typeof object[key] == 'object'){
						copied[key] = copy(object[key]);
					}else{
						copied[key] = object[key];
					}
				}
			}

			return copied;
		}

	})();


})(window,'SW');


// 兼容處理
if( !('bind' in Function.prototype) ){
	Function.prototype.bind = function( context ){
		var fn = this;
		return function(){
			fn.apply( context, Array.prototype.slice.call(arguments,0) );
		}
	}
}