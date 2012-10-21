//時間線

SW.define('modules/timeline', function(require, exports, module){

	var TimeLine = SW.Class.extend({

		// 內部屬性
		id: undefined,
		startTime: 0,
		lastStopTime: 0,
		lastTick: 0,
		procs: [],

		// 公開屬性
		isRunning: false,

		init: function(){

		},

		addProc: function(proc){
			var self = this;

			if(typeof proc == 'function'){
				self.procs.push(proc);
			}

			if(!self.isRunning){
				self.start();
			}
		},

		removeProc: function(proc){
			var self = this;

			for(var i=0, len=self.procs.length; i<len; i++){
				if(self.procs[i] == proc){
					self.procs.splice(i, 1);
					break;
				}
			}

			if(self.procs.length == 0){
				self.stop();
			}
		},

		getTick: function(){
			var
				self = this,
				now = new Date().getTime();

			if(self.isRunning){
				return now - self.startTime;
			}else{
				return self.lastStopTime - self.startTime;
			}
		},

		start: function(){
			var self = this;

			if(self.id){
				return;
			}

			self.startTime += new Date().getTime() - self.lastStopTime;
			self.lastStopTime = 0;
			self.lastTick = self.startTime;
			self.id = setInterval(self.process.bind(self),10);
			self.isRunning = true;
		},

		stop: function(){
			var self = this;

			clearInterval(self.id);
			self.id = undefined;
			self.lastStopTime = new Date().getTime();
			self.isRunning = false;
		},

		process: function(){
			var
				self = this,
				now = new Date().getTime(),
				tick = now - self.startTime;

			for(var i=0, len=self.procs.length; i<len; i++){
				self.procs[i](tick, tick - self.lastTick);
			}

			self.lastTick = tick;
		},

		drop: function(){
			var self = this;

			self.stop();
			self.procs = [];
		}

	});

	return TimeLine;
});