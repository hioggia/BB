//事件控制

SW.define('modules/eventhost', function(require, exports, module){

	var EventHost = SW.Class.extend({

		bindEvents: {},
		liveEvents: {},

		init: function(){

		},

		bind: function(object, eventType, handler){
			var
				self = this,
				eventList = self.bindEvents[eventType];

			object.addEventListener(eventType, handler, false);

			if(eventList instanceof Array){
				eventList.push(object, handler);
			}else{
				self.bindEvents[eventType] = [object, handler];
			}
		},

		unbind: function(object, eventType, handler){
			var
				self = this,
				eventList = self.bindEvents[eventType];

			if(typeof handler == 'function'){
				object.removeEventListener(eventType, handler, false);
				if(eventList instanceof Array){
					for(var i=0, len=eventList.length; i<len; i+=2){
						if(eventList[i] == object && eventList[i+1] == handler){
							eventList.splice(i, 2);
							break;
						}
					}
				}
			}else{
				if(eventList instanceof Array){
					for(var i=eventList.length-2; i>=0; i-=2){
						if(eventList[i] == object){
							object.removeEventListener(eventType, eventList[i+1], false);
							eventList.splice(i, 2);
						}
					}
				}
			}
		},

		live: function(object, eventType, selector, handler){

		},

		die: function(object, eventType, selector, handler){

		},

		trigger: function(object, eventType, eventObject){
			var
				self = this,
				bindEventList = self.bindEvents[eventType],
				liveEventList = self.liveEvents[eventType];

			if(bindEventList instanceof Array){
				for(var i=0, len=bindEventList.length; i<len; i+=2){
					if(bindEventList[i] == object){
						bindEventList[i](eventObject);
					}
				}
			}
			if(liveEventList instanceof Array){
				for(var i=0, len=liveEventList.length; i<len; i+=3){
					
				}
			}
		},

		drop: function(){
			var self = this;

			for(var key in self.bindEvents){
				for(var eventList=self.bindEvents[key], i=eventList.length-2; i>=0; i-=2){
					eventList[i].removeEventListener(key, eventList[i+1], false);
					eventList.splice(i, 2);
				}
			}
			for(var key in self.liveEvents){
				for(var eventList=self.liveEvents[key], i=eventList.length-3; i>=0; i-=3){
					eventList[i].removeEventListener(key, eventList[i+2], false);
					eventList.splice(i, 3);
				}
			}
		}

	});

	return EventHost;
});