//基本模型

SW.define('game/module/controller1', function(require, exports, module){

	var
		EventHost = require('modules/eventhost'),
		typeOfTouchEvent = 'ontouchstart' in window,
		typeOfStartEvent = typeOfTouchEvent ? 'touchstart' : 'mousedown',
		typeOfMoveEvent = typeOfTouchEvent ? 'touchmove' : 'mousemove',
		typeOfEndEvent = typeOfTouchEvent ? 'touchend' : 'mouseup',

		GameController = SW.Class.extend({

			canvas: null,
			controller: null,

			isStarted: false,
			customEvents: {
				'start': [],
				'drawing': [],
				'end': []
			},

			init: function(canvas){
				var self = this;

				self.canvas = canvas;
				self.controller = new EventHost();

				self.controller.bind(window, 'touchstart', function(ev){ ev.preventDefault() });
				self.controller.bind(self.canvas, typeOfStartEvent, self.startEvent.bind(self));
				self.controller.bind(self.canvas, typeOfEndEvent, self.endEvent.bind(self));
				self.controller.bind(self.canvas, typeOfMoveEvent, self.moveEvent.bind(self));
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
					x = 0,
					y = 0;

				self.isStarted = true;

				if(ev.touches){
					if(ev.touches.length > 1){
						return;
					}
					x = ev.touches[0].pageX;
					y = ev.touches[0].pageY;
				}else{
					x = ev.pageX;
					y = ev.pageY;
				}

				for(var i=0, len=self.customEvents.start.length; i<len; i++){
					self.customEvents.start[i].call(null, x, y);
				}
			},

			endEvent: function(ev){
				var
					self = this,
					x = 0,
					y = 0;

				self.isStarted = false;

				if(ev.changedTouches){
					if(ev.changedTouches.length > 1){
						return;
					}
					x = ev.changedTouches[0].pageX;
					y = ev.changedTouches[0].pageY;
				}else{
					x = ev.pageX;
					y = ev.pageY;
				}

				for(var i=0, len=self.customEvents.end.length; i<len; i++){
					self.customEvents.end[i].call(null, x, y);
				}
			},

			moveEvent: function(ev){
				var
					self = this,
					x = 0,
					y = 0;

				if(!self.isStarted){
					return;
				}

				if(ev.changedTouches){
					if(ev.changedTouches.length > 1){
						return;
					}
					x = ev.changedTouches[0].pageX;
					y = ev.changedTouches[0].pageY;
				}else{
					x = ev.pageX;
					y = ev.pageY;
				}

				for(var i=0, len=self.customEvents.drawing.length; i<len; i++){
					self.customEvents.drawing[i].call(null, x, y);
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