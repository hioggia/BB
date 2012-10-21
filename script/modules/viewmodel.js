//基本模型

SW.define('modules/viewmodel', function(require, exports, module){

	var ViewModel = SW.Class.extend({

			x: 0,
			y: 0,
			width: 0,
			height: 0,

			init: function( x, y, width, height ){
				var self = this;

				self.x = x;
				self.y = y;
				self.width = width;
				self.height = height;
			},

			drop: function(){
				var self = this;

			}

		});

	return ViewModel;
});