//舞臺

SW.define('game/module/stage', function(require, exports, module){

	var

		puzz = require('game/module/puzzlib'),
		EventHost = require('modules/eventhost'),
		Peach = require('game/model/peach'),

		Stage = SW.Class.extend({

			settings: null,
			eventHost: null,
			cache: null,

			bgUrl: '',

			level: -1,
			score: 0,
			countdown: 0,
			mode: undefined,
			maxCountdown: 0,
			countdownPercent: 100,

			state: -1,
			/*
			-1: new level / wait touch
			0: idle
			1: showing puzz
			2: answering
			3: showing result
			4: wait touch
			*/

			nowPuzz: null,
			answer: undefined,
			endWait: undefined,

			models: [],

			pinAniBeginTime: undefined,
			pinAniOpacity: 0,

			init: function( mode ){
				var self = this;

				self.settings = SW.gameEnvir.settings;
				self.cache = SW.gameEnvir.cache;
				self.eventHost = new EventHost();
				self.mode = mode;
				self.maxCountdown = [10,30][mode];

				self.bgUrl = self.settings.bgUrls[Math.floor(Math.random()*self.settings.bgUrls.length)];

				setTimeout(function(){
					self.eventHost.bind( window, SW.gameEnvir.clickEvent, function(ev){
						switch(self.state){
							case -1:
								self.state++;
								break;
						}
					} );
				},100);

			},

			update: function(tick, delta){
				var self = this;

				//更新
				switch(self.state){
					case -1:
						if(self.pinAniBeginTime == undefined){
							self.pinAniBeginTime = tick;
						}
						var lin = (tick - self.pinAniBeginTime) % 1000;
						if(lin <=200){
							self.pinAniOpacity = lin/200*0.8;
						}else{
							self.pinAniOpacity = (1000 -lin)/800*0.8;
						}
						break;
					case 0:
						self.nowPuzz = puzz(self.level, self.mode);
						self.state = 1;
						self.answer = undefined;

						var peach = new Peach( self.nowPuzz.answer );
						self.models.push( peach );
						peach.onState('in');

						break;
					case 1:
						//如何轉變成2
						for(var i=0,ready=0,len=self.models.length;i<len;i++){
							self.models[i].update(tick, delta);
							if(self.models[i].state == 'idle'){
								ready++;
							}
						}
						if(ready == len){
							self.state = 2;
							self.countdown = tick + self.maxCountdown*1000;
						}
						break;
					case 2:
						for(var i=0,len=self.models.length;i<len;i++){
							self.models[i].update(tick, delta);
						}
						self.countdownPercent = (self.countdown - tick) /self.maxCountdown /1000;
						if(self.countdownPercent <= 0){
							//時間到
							self.getAnswer(2);
						}
						break;
					case 3:
						//顯示結果
						//完成時轉變成4
						for(var i=0,ready=0,len=self.models.length;i<len;i++){
							self.models[i].update(tick, delta);
							if(self.models[i].state == 'exit'){
								ready++;
							}
						}
						if(ready == len){
							for(var i=0,ready=0,len=self.models.length;i<len;i++){
								self.models[i].drop();
							}
							self.models = [];
							self.state = 0;
						}
						break;
				}
			},

			drawTo: function(context){
				var
					self = this,
					settings = self.settings;

				//畫到context上
				self.cache.drawTo(context,self.bgUrl,0,0,settings.width,settings.height);
				switch(self.state){
					case -1:
						self.cache.drawTo(context,'image/ui/quiz.png',settings.width*0.15,settings.height*0.4);

						context.save();
						context.globalAlpha = self.pinAniOpacity;
						self.cache.drawTo(context, 'image/ui/footpin.png',settings.width*0.58,settings.height*0.76);
						context.restore();

						self.cache.drawTo(context,'image/ui/touch.png',settings.width*0.38,settings.height*0.8);
						break;
					case 1:
						for(var i=0,len=self.models.length;i<len;i++){
							self.models[i].drawTo(context);
						}
						break;
					case 2:
						for(var i=0,len=self.models.length;i<len;i++){
							self.models[i].drawTo(context);
						}
						context.save();

						var
							x = 10,
							y = 17,
							countdownBarWidth = settings.width - 100,
							height = 10;

						context.strokeStyle = 'rgba(60,60,60,0.8)';
						context.lineWidth = 2;
						context.strokeRect(x, y, countdownBarWidth, height);
						context.fillStyle = 'rgba(36,135,227,0.7)';
						context.fillRect(x, y, Math.floor(countdownBarWidth * self.countdownPercent), height);

						context.restore();
						break;
					case 3:
						for(var i=0,len=self.models.length;i<len;i++){
							self.models[i].drawTo(context);
						}
						break;
				}

				//draw score
				context.save();

				context.fillStyle = 'rgba(36,135,227,0.7)';
				context.fillRect(0, settings.height-self.score*2, settings.width,self.score*2);

				context.restore();
			},

			getAnswer: function(answer){
				var self = this,
					command = '';

				//回答時間
				self.answer = answer;
				switch(self.answer){
					case 0:
						self.score += Math.pow(2,self.level);
						self.state = 3;
						command = 'yes';
						SW.gameEnvir.se.yes.play();
						break;
					case 1:
						command = 'no';
						SW.gameEnvir.se.no.play();
						break;
					case 2:
						self.state = 3;
						command = 'out';
						SW.gameEnvir.se.no.play();
						break;
				}
				for(var i=0,len=self.models.length;i<len;i++){
					self.models[i].onState(command);
				}
			},

			drop: function(){
				var self = this;

				self.eventHost.drop();
				self.cache = null;
			}

		});

	return Stage;
});