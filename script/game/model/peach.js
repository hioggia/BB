//基本模型

SW.define('game/model/peach', function(require, exports, module){

	var

		Model = require('game/module/model'),

		PeachModel = Model.extend({

			settings: null,
			number: 0,
			width: 0,
			height: 0,
			w: [],
			h: [],
			x: [],
			y: [],
			vx: [],
			vy: [],
			state: null,
			stateTime: 0,
			targetTime: 1500,

			init: function( number ){
				var self = this;
				self.settings = SW.gameEnvir.settings;

				self.width = self.settings.peach.width;
				self.height = self.settings.peach.height;
				self.parent( 'init', [], [], self.width, self.height, self.settings.peach.url[Math.floor(Math.random()*self.settings.peach.url.length)] );

				self.number = number;

				for(var i = 0; i < number; i++)
				{
					self.w[i] = self.width;
					self.h[i] = self.height;
					var sw = self.settings.width*(0.05*Math.random()+1);
					var sh = self.settings.height*(0.05*Math.random()+1);

					self.x[i] = Math.cos(i*Math.PI*2.0/number)*self.width*1.4;
					self.y[i] = Math.sin(i*Math.PI*2.0/number)*self.height*1.0;
					if(number == 1)
					{
						self.x[i] = 0;
						self.y[i] = 0;
						self.vx[i] = 0.5*sw/self.targetTime;
						self.vy[i] = 0.5*sh/self.targetTime;
					}

					self.vx[i] = 0.37*sw/self.targetTime*(0.1*Math.random()+1);
					self.vy[i] = 0.3*sh/self.targetTime*(0.1*Math.random()+1);

				}
			},

			update: function(tick, dt){
				var self = this;

				if(self.state == "in")
				{
					self.stateTime += dt;

					if(self.stateTime < self.targetTime)
					{
						for(var i = 0; i < self.number; i++)
						{
							self.x[i] += self.vx[i]*dt;
							self.y[i] += self.vy[i]*dt;
						}

					}
					else
					{
						self.state = "idle";
						self.stateTime = 0;
					}

				}


				if(self.state == "out")
				{
					self.stateTime += dt;
					if(self.stateTime < self.targetTime)
					{
						for(var i = 0; i < self.number; i++)
						{
							self.y[i] -= 10;
						}
					}
					else
					{
						self.state = "exit";
						self.stateTime = 0;
					}
				}

				if(self.state == "yes")
				{
					self.stateTime += dt;
					if(self.stateTime < self.targetTime)
					{
						for(var i = 0; i < self.number; i++)
						{
							self.y[i] -= 10;
						}
					}
					else
					{
						self.state = "exit";
						self.stateTime = 0;
					}
				}


				if(self.state == "no")
				{
					self.stateTime += dt;
					if(self.stateTime < self.targetTime)
					{
						for(var i = 0; i < self.number; i++)
						{
							self.x[i] += Math.sin(tick*0.51) * 10;
						}

					}
					else
					{
						self.state = "idle";
						self.stateTime = 0;
					}
				}


				if(self.state == "idle")
				{
					for(var i = 0; i < self.number; i++)
					{
						self.y[i] += 0.12*Math.sin(tick*0.0025);
					}

				}

				for(var i = 0; i < self.number; i++)
				{
					self.h[i] = self.width*(1.0 + 0.05*Math.sin(tick*0.0045+ i));
				}
			},


			onState: function(state)
			{
				var self = this;
				self.state = state;
				// if(self.state == "in") self.targetTime = 1000;
				if(self.state == "no") self.targetTime = 500;
				if(self.state == "yes") self.targetTime = 1000;
				if(self.state == "out") self.targetTime = 1000;

			},

			drawTo: function(context){
				var
					self = this;

				//畫到context上
				for(var i = 0; i < self.number; i++)
				{
					self.cache.drawTo(context, self.imgUrl, self.x[i], self.y[i],
						self.w[i], self.h[i]);
				}
			},

			drop: function(){
				var self = this;

				self.parent('drop');
				self.cache = null;
			}

		});

	return PeachModel;
});