//主入口

SW.define('game/main', function(require, exports, module){

	var
		TimeLine = require('modules/timeline'),
		ImageCache = require('modules/imagecache'),

		canvas = document.querySelector('canvas'),
		context  = null,
		settings = require('game/settings'),
		startRender = require('game/page/start'),
		CommonRender = require('game/page/common'),
		commonRender = null,
		timeline = new TimeLine(),
		cache = new ImageCache();

	canvas.width = settings.width;
	canvas.height = settings.height;
	context = canvas.getContext('2d');
	context.font = settings.fontSize +'px '+ settings.font;

	var se = {
		yes: new Audio('sound/yes.wav'),
		no: new Audio('sound/no.wav')
	};

	var bgm = new Audio('sound/bgm.mp3');
	bgm.addEventListener('canplaythrough', function(){
		bgm.play();
		bgm.volume = 0.3;
	}, false);
	bgm.addEventListener('ended', function(){
		bgm.currentTime = 0;
		bgm.play();
	}, false);

	SW.gameEnvir = {
		canvas: canvas,
		context: context,
		settings: settings,
		timeline: timeline,
		cache: cache,
		commonRender: commonRender,
		gotoStart: gotoStart,
		clickEvent: ('ontouchstart' in window) ? 'touchend' : 'mouseup',
		se: se
	};

	function beginMode(mode){
		require('game/page/mode'+mode,function(exports){
			SW.gameEnvir.commonRender = new CommonRender();
			exports();
		});
	}

	function gotoStart(){
		startRender(beginMode);
	}

	gotoStart();

	return 0;
});