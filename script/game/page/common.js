//

SW.define('game/page/common', function(require, exports, module){

	var
		EventHost = require('modules/eventhost'),
		box = require('modules/box'),

		CommonRender = SW.Class.extend({

			eventhost: null,
			ui: {
				close: {
					imgUrl: 'image/ui/close.png',
					right: 5,
					top: 5,
					width: 64,
					height: 64
				}
			},
			cache: null,
			settings: null,
			engGameHandler: null,

			init: function(){
				var self = this;

				self.eventhost = new EventHost();
				self.cache = SW.gameEnvir.cache;
				self.settings = SW.gameEnvir.settings;
				self.eventhost.bind(SW.gameEnvir.canvas, SW.gameEnvir.clickEvent, function(ev){
					var
						point = ev,
						result = null;
					if(ev.changedTouches){
						if(ev.changedTouches.length > 1){
							return;
						}
						point = ev.changedTouches[0];
					}
					for(var key in self.ui){
						var unit = self.ui[key];
						result = box.composite(point.pageX,point.pageY,1,1,unit.x,unit.y,unit.width,unit.height);
						if(result.width>0 && result.height>0){
							if(key == 'close'){
								self.engGameHandler();
								self.drop();
								SW.gameEnvir.gotoStart();
							}
						}
					}
				});
			},

			setEndGame: function(handler){
				var self = this;

				self.engGameHandler = handler;
			},

			drawTo: function(context){
				var self = this;

				for(var key in self.ui){
					var unit = self.ui[key], x = 0, y = 0;
					if('x' in unit){
						x = unit.x;
					}else if('left' in unit){
						x = unit.left;
						unit.x = x;
					}else if('right' in unit){
						x = self.settings.width - unit.right - unit.width;
						unit.x = x;
					}
					if('y' in unit){
						y = unit.y;
					}else if('top' in unit){
						y = unit.top;
						unit.y = y;
					}else if('bottom' in unit){
						y = self.settings.height - unit.bottom - unit.height;
						unit.y = y;
					}
					self.cache.drawTo(context, unit.imgUrl, x, y, unit.width, unit.height);
				}
			},

			drop: function(){
				var self = this;

				self.eventhost.drop();
				self.cache = null;
				self.engGameHandler = null;
			}

		});

	return CommonRender;
});