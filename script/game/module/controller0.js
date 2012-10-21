//基本模型

SW.define('game/module/controller0', function(require, exports, module){

	var
		EventHost = require('modules/eventhost'),
		typeOfTouchEvent = 'ontouchstart' in window,
		typeOfStartEvent = typeOfTouchEvent ? 'touchstart' : 'mousedown',
		typeOfEndEvent = typeOfTouchEvent ? 'touchend' : 'mouseup',

		GameController = SW.Class.extend({

			canvas: null,
			controller: null,

			isStarted: false,
			customEvents: {
				'start': [],
				'end': []
			},

			init: function(canvas){
				var self = this;

				self.canvas = canvas;
				self.controller = new EventHost();

				self.controller.bind(window, 'touchstart', function(ev){ ev.preventDefault() });
				self.controller.bind(self.canvas, typeOfStartEvent, self.startEvent.bind(self));
				self.controller.bind(self.canvas, typeOfEndEvent, self.endEvent.bind(self));
			},

			addControl: function(type, handler){
				var self = this;
				
				if(type in self.customEvents){
					self.customEvents[type].push( handler );
				}
			},

			startEvent: function(ev){
				var
					self = this,
					points = [];

				self.isStarted = true;

				if(ev.touches){
					points = ev.touches;
				}else{
					points = [{pageX:ev.pageX,pageY:ev.pageY}];
				}

				for(var i=0, len=self.customEvents.start.length; i<len; i++){
					self.customEvents.start[i].call(null, points);
				}
			},

			endEvent: function(ev){
				var
					self = this,
					points = [];

				self.isStarted = false;

				if(ev.changedTouches){
					points = ev.changedTouches;
				}else{
					points = [{pageX:ev.pageX,pageY:ev.pageY}];
				}

				for(var i=0, len=self.customEvents.end.length; i<len; i++){
					self.customEvents.end[i].call(null, points);
				}
			},

			drop: function(){
				var self = this;

				self.controller.drop();
				self.controller = null;
				self.canvas = null;

				for(var key in self.customEvents){
					self.customEvents[key] = [];
				}
			}

		});

	return GameController;
});