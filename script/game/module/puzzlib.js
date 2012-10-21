//題庫

SW.define('game/module/puzzlib', function(require, exports, module){

	var
		puzzMinNum = 1,
		puzzModeMaxNum = {
			0: 5,
			1: 10
		},
		puzzLevelMinNoize = {
			0: 0,
			1: 1,
			2: 0
		},
		puzzLevelMaxNoize = {
			0: 0,
			1: 5,
			2: 3
		},
		puzzLevelMinActive = {
			0: 0,
			1: 0,
			2: 1
		},
		puzzLevelMaxActive = {
			0: 0,
			1: 0,
			2: 3
		},

		lastAnswer = 0;

	function getRandom(min, max){
		var m = Math;
		return m.floor(m.random()*(max-min))+min;
	}

	return function(level, mode){
		var
			answer = getRandom(puzzMinNum,puzzModeMaxNum[mode]),
			noize = getRandom(puzzLevelMinNoize[level],puzzLevelMaxNoize[level]),
			active = getRandom(puzzLevelMinActive[level],puzzLevelMaxActive[level]);

		while(answer == lastAnswer){
			answer = getRandom(puzzMinNum,puzzModeMaxNum[mode]);
		}

		lastAnswer = answer;
			
		return {
			answer: answer,
			noize: noize,
			active: active
		};
	}
});