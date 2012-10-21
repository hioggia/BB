//基本模型

SW.define('game/module/model', function(require, exports, module){

	var

		ViewModel = require('modules/viewmodel'),

		Model = ViewModel.extend({

			imgUrl: undefined,
			cache: null,

			init: function( x, y, width, height, imgUrl ){
				var self = this;

				self.parent( 'init', x, y, width, height );
				self.imgUrl = imgUrl;
				self.cache = SW.gameEnvir.cache;
			},

			update: function(tick){
				var self = this;

				//更新
			},

			drawTo: function(context, x, y){
				var
					self = this;

				//畫到context上
			},

			drop: function(){
				var self = this;

				self.parent('drop');
				self.cache = null;
			}

		});

	return Model;
});