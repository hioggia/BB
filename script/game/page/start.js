//

SW.define('game/page/start', function(require, exports, module){

	var
		EventHost = require('modules/eventhost'),
		box = require('modules/box'),
		Logo = require('game/model/logo'),
		bgUrls = ['image/ui/s_01.jpg','image/ui/s_02.jpg','image/ui/s_03.jpg','image/ui/s_04.jpg','image/ui/s_05.jpg'],
		bgPieceWidth = 456,

		startRender = function(beginMode){
			var
				settings = SW.gameEnvir.settings,
				context = SW.gameEnvir.context,
				cache = SW.gameEnvir.cache,
				timeline = SW.gameEnvir.timeline,
				bgIndex = 0,
				scrollLeft = 0,
				duration = 1000 / settings.fps,
				elapseTime = 0,
				eventhost = new EventHost(),
				logo = new Logo(),
				logoEnd = false,
				btnO = 0,
				bindedEvent = false,
				modesBtn = [
					{x:settings.width*0.18,y:settings.height*0.74,width:settings.width*0.28,height:settings.height*0.18},
					{x:settings.width*0.57,y:settings.height*0.74,width:settings.width*0.28,height:settings.height*0.18}
				];

			timeline.addProc(paint);
			
			function paint(tick, delta){

				scrollLeft = tick/3;
				logo.update(tick, delta);

				if(!logoEnd && logo.state == 'idle'){
					logoEnd = tick;
				}
				if(logoEnd && tick-logoEnd>1000 && btnO<1){
					btnO += delta/700;
				}
				if(!bindedEvent && btnO>=1){
					bindedEvent = true;
					eventhost.bind(SW.gameEnvir.canvas, SW.gameEnvir.clickEvent, function(ev){
						var
							point = ev,
							result = null;
						if(ev.changedTouches){
							if(ev.changedTouches.length > 1){
								return;
							}
							point = ev.changedTouches[0];
						}
						for(var i=0,len=modesBtn.length;i<len;i++){
							result = box.composite(point.pageX,point.pageY,1,1,modesBtn[i].x,modesBtn[i].y,modesBtn[i].width,modesBtn[i].height);
							if(result.width>0 && result.height>0){
								dropRender();
								return beginMode(i);
							}
						}
					});
				}

				if( (tick - elapseTime) / duration > 1 ){

					bgIndex = Math.floor(scrollLeft / bgPieceWidth) % 5;
					var bgRight = bgIndex * bgPieceWidth - scrollLeft;
					while(bgRight<settings.width){
						cache.drawTo(context,bgUrls[bgIndex++],bgRight,0,bgPieceWidth,settings.height);
						bgRight+=bgPieceWidth;
						bgIndex%=5;
					}

					logo.drawTo(context);

					if(logoEnd){
						context.save();
						if(btnO<1){
							context.globalAlpha = btnO;
						}
						cache.drawTo(context,'image/ui/btn.png',99,430,942,243);
						context.restore();
					}

					/*context.save();
					context.fillStyle = 'rgba(0,0,0,.5)';
					for(var i=0,len=modesBtn.length;i<len;i++){
						var nowBtn = modesBtn[i];
						context.fillRect(nowBtn.x,nowBtn.y,nowBtn.width,nowBtn.height);
					}
					context.restore();*/
					
				}
				elapseTime = tick - tick % duration;

			}

			function dropRender(){
				eventhost.drop();
				timeline.removeProc(paint);
				logo.drop();
				logo = null;
			}
		};

	return startRender;
});