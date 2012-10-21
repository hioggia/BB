//基本模型

SW.define('game/model/logo', function(require, exports, module){

	var

		Model = require('game/module/model'),
		easing = require('modules/ease'),

		LogoModel = Model.extend({

			settings: null,
			state: '',
			distanceY: 0,
			beginTime: undefined,
			

			init: function(){
				var self = this;

				self.settings = SW.gameEnvir.settings;
				self.parent( 'init', 300, -400, self.settings.logo.width, self.settings.logo.height, self.settings.logo.url );
				self.state = 'in';
				self.distanceY = 450;
			},

			update: function(tick, dt){
				var self = this;

				if(self.beginTime == undefined){
					self.beginTime = tick;
				}

				if(self.state == "in"){
					var percent = easing('ease in', (tick - self.beginTime)/2000);
					self.y = self.distanceY * percent - 400;
					if(percent >= 1){
						self.state = 'idle';
					}
				}else if(self.state == "idle"){
					self.y += Math.sin(tick*0.01);
					self.height = self.width*(0.6 + 0.01*Math.sin(tick*0.005));
				}

			},

			drawTo: function(context){
				var
					self = this;

				//畫到context上
				self.cache.drawTo(context, self.imgUrl, self.x, self.y, self.width, self.height);
			},

			drop: function(){
				var self = this;

				self.parent('drop');
				self.settings = null;
			}

		});

	return LogoModel;
});