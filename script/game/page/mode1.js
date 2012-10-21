//

SW.define('game/page/mode1', function(require, exports, module){

	var
		EventHost = require('modules/eventhost'),
		box = require('modules/box'),
		evaluation = require('game/module/evaluation'),
		GameController = require('game/module/controller1'),
		Stage = require('game/module/stage'),

		duration = 0,
		elapseTime = 0,
		drawingPoints = [],
		waitingDraw = 0,

		timeline = null,
		context = null,
		settings = null,
		commonRender = null,
		stage = null,
		controller = null,
		cache = null,

		level = 0,
		score = 0,
		countdown = 60,

		PaintMode = function(){
			timeline = SW.gameEnvir.timeline;
			context = SW.gameEnvir.context;
			settings = SW.gameEnvir.settings;
			commonRender = SW.gameEnvir.commonRender;
			cache = SW.gameEnvir.cache;
			duration = 1000 / settings.fps;
			elapseTime = 0;
			drawingPoints = [];
			waitingDraw = 0;

			stage = new Stage(1);
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

			context.save();
			context.strokeStyle = 'rgba(36,135,227,0.7)';
			context.lineWidth = settings.paintWidth*2;
			context.lineCap = 'round';
			context.beginPath();
			for(var i=0, len=drawingPoints.length; i<len; i+=2){
				if(drawingPoints[i] == '-'){
					i++;
					context.moveTo(drawingPoints[i], drawingPoints[i+1]);
				}else{
					context.lineTo(drawingPoints[i], drawingPoints[i+1]);
				}
			}
			context.stroke();
			context.restore();
		}
		elapseTime = tick - tick % duration;
	};

	function endGame(){
		timeline.removeProc(gameRun);
		controller.drop();
		stage.drop();
		stage = null;
	}

	function evaluationShape(){
		var result = evaluation(drawingPoints, settings.paintWidth, stage.nowPuzz.answer);
		drawingPoints = [];
		if(result){
			stage.getAnswer(0);
		}else{
			stage.getAnswer(1);
		}		
	};

	function bindControl(){
		controller.addControl('start', function(x, y){
			if(stage.state != 2){
				drawingPoints = [];
				return;
			}
			clearTimeout(waitingDraw);
			drawingPoints.push('-', x, y);
		});

		controller.addControl('drawing', function(x, y){
			if(stage.state != 2){
				drawingPoints = [];
				return;
			}
			drawingPoints.push(x, y);
		});

		controller.addControl('end', function(x, y){
			if(stage.state != 2){
				drawingPoints = [];
				return;
			}
			drawingPoints.push(x, y);
			waitingDraw = setTimeout(function(){
				evaluationShape();
			},800);
		});
	}

	return PaintMode;
});