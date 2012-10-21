//

SW.define('game/page/mode0', function(require, exports, module){

	var
		EventHost = require('modules/eventhost'),
		box = require('modules/box'),
		GameController = require('game/module/controller0'),
		Stage = require('game/module/stage'),

		duration = 0,
		elapseTime = 0,
		touchPoints = [],

		timeline = null,
		context = null,
		settings = null,
		commonRender = null,
		stage = null,
		controller = null,
		cache = null,

		TouchMode = function(){
			timeline = SW.gameEnvir.timeline;
			context = SW.gameEnvir.context;
			settings = SW.gameEnvir.settings;
			cache = SW.gameEnvir.cache;
			commonRender = SW.gameEnvir.commonRender;
			duration = 1000 / settings.fps;
			elapseTime = 0;
			touchPoints = [];

			stage = new Stage(0);
			timeline.addProc(gameRun);
			commonRender.setEndGame(endGame);
			controller = new GameController(SW.gameEnvir.canvas);
			bindControl();
		};

	function gameRun(tick, delta){
		stage.update(tick, delta);

		if( (tick - elapseTime) / duration > 1 ){
			stage.drawTo(context);
			commonRender.drawTo(context);
		}

		elapseTime = tick - tick % duration;
	};

	function endGame(){
		timeline.removeProc(gameRun);
		controller.drop();
		stage.drop();
		stage = null;
	}

	function evaluationPoint(){
		if(touchPoints.length == stage.nowPuzz.answer){
			stage.getAnswer(0);
		}else{
			stage.getAnswer(1);
		}

		touchPoints = [];
	}

	function bindControl(){
		controller.addControl('start', function(points){
			if(stage.state != 2){
				return;
			}
			touchPoints = points;
		});

		controller.addControl('end', function(points){
			if(stage.state != 2){
				return;
			}
			if(points.length == 1){
				evaluationPoint(touchPoints);
			}
		});
	}

	return TouchMode;
});