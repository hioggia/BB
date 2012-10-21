//基本模型

SW.define('modules/camera', function(require, exports, module){

	var Camera = SW.Class.extend({

		x: 0,
		y: 0,
		minX: 0,
		maxX: Infinity,
		minY: 0,
		maxY: Infinity,

		watchingViewModel: null,

		init: function(){
			var self = this;
		},

		resetMinX: function(x){
			var self = this;

			if(x != null){
				self.minX = x;
			}else{
				self.minX = 0;
			}
		},

		resetMaxX: function(x){
			var self = this;

			if(x != null){
				self.maxX = x;
			}else{
				self.maxX = Infinity;
			}
		},

		resetMinY: function(y){
			var self = this;

			if(y != null){
				self.minY = y;
			}else{
				self.minY = 0;
			}
		},

		resetMaxY: function(y){
			var self = this;

			if(y != null){
				self.maxY = y;
			}else{
				self.maxY = Infinity;
			}
		},

		watch: function(x, y, minScreenX, minScreenY, maxScreenX, maxScreenY){
			var
				self = this,
				screenX = x - self.x,
				screenY = y - self.y;

			if(screenX > maxScreenX){
				self.x = Math.min(self.maxX, x - maxScreenX);
			}else if(screenX < minScreenX){
				self.x = Math.max(self.minX, x - minScreenX);
			}

			if(screenY > maxScreenY){
				self.y = Math.min(self.maxY, y - maxScreenY);
			}else if(screenY < minScreenY){
				self.y = Math.max(self.minY, y - minScreenY);
			}
		},

		watchX: function(x, minScreenX, maxScreenX){
			var self = this;

			self.watch(x, 0, minScreenX, 0, maxScreenX, 0);
		},

		watchY: function(y, minScreenY, maxScreenY){
			var self = this;

			self.watch(y, 0, minScreenY, 0, maxScreenY, 0);
		},

		impactScreen: function(){},

		closeUp: function(){},

		drop: function(){
			var self = this;
		}

	});

	return Camera;
});