// 圖像快取管理員

SW.define('modules/imagecache', function(require, exports, module){

	var ImageCache = SW.Class.extend({

		attached: 0,
		cached: 0,
		callbacks: [],
		loading: {},
		animeIndex: {},
		caches: {},

		onload: null,
		onerror: null,

		init: function(){
			var self = this;

			self.onload = self._onload.bind(self);
			self.onerror = self._onerror.bind(self);
		},

		attach: function( url ){
			var self = this;

			if( (url in self.caches) || (url in self.loading) ){
				return;
			}
			
			SW.trace( '將圖像載入快取: ' + url );
			
			self.attached++;
			
			var img = self.loading[url] = new Image();
			self.animeIndex[url] = 0;
			
			img.addEventListener( 'load', self.onload, false );
			img.addEventListener( 'error', self.onerror, false );
			
			img.setAttribute('data-url', url);
			img.src = url;
		},

		erase: function( url ){
			var self = this;

			if( url in self.caches ){
				SW.trace('移除快取: ' + url);

				self.caches[url] = null;
				delete self.caches[url];

				self.cached--;
				self.attached--;
			}
		},

		get: function( url ){
			var self = this;
				
			if( url in self.caches ){
				return self.caches[url];
			}
			
			SW.trace( '請求的圖像不存在快取中: ' + url );
			return null;
		},

		complete: function( callback ){
			var self = this;
				
			if( typeof callback != 'function' ){
				return;
			}
			
			for( var i=0, len=self.callbacks.length; i<len; i++ ){
				if( self.callbacks[i] == callback ){
					return;
				}
			}
			
			SW.trace('快取回調已設置');
			self.callbacks.push( callback );
		},

		has: function( url ){
			var self = this;
				
			return url in self.caches;
		},
		
		clear: function(){
			var self = this;
			
			self.attached = 0;
			self.cached = 0;
			self.callbacks = [];
			
			for(var url in self.loading){
				self.loading[url].removeEventListener( 'load', self.onload, false );
				self.loading[url].removeEventListener( 'error', self.onerror, false );
				self.loading[url].removeAttribute('data-url');
				self.loading[url] = null;
				delete self.loading[url];
				delete self.animeIndex[url];
			}
			
			for(var url in self.caches){
				self.caches[url] = null;
				delete self.caches[url];
			}

			SW.trace('快取已清零');
		},

		drawTo: function(context, url){
			var
				self = this,
				args = Array.prototype.slice.call(arguments,2);

			if(!self.has(url)){
				self.attach(url);
				var
					cx = 0,
					cy = 0,
					cwidth = 0,
					cheight = 0;
				switch(args.length){
					case 4:
						cx = args[0], cy = args[1], cwidth = args[2], cheight = args[3];
						break;
					case 8:
						cx = args[4], cy = args[5], cwidth = args[6], cheight = args[7];
						break;
					default:
						return;
				}
				drawLoadingEffect(context, self.animeIndex[url]+=10, cx, cy, cwidth, cheight);
				return;
			}

			context.drawImage.apply( context, [self.get(url)].concat(args) );
		},

		drop: function(){
			var self = this;

			self.clear();
			self.caches = null;
			self.loading = null;
			self.animeIndex = null;
			self.onload = null;
			self.onerror = null;
		},
		
		_onload: function( ev ){
			var
				self = this,
				img = ev.target,
				url = img.getAttribute('data-url');
			
			self.caches[url] = img;
			self.loading[url] = null;
			delete self.loading[url];
			delete self.animeIndex[url];
			
			img.removeEventListener( 'load', self.onload, false );
			img.removeEventListener( 'error', self.onerror, false );
			
			self.cached++;
			
			if( self.cached == self.attached && self.callbacks.length > 0 ){
				for(var i=0, len=self.callbacks.length; i<len; i++ ){
					self.callbacks.shift()();
				}
			}
		},
		
		_onerror: function( ev ){
			var
				self = this,
				img = ev.target,
				url = img.getAttribute('data-url');
			
			self.loading[url] = null;
			delete self.loading[url];
			delete self.animeIndex[url];
			
			img.removeEventListener( 'load', self.onload, false );
			img.removeEventListener( 'error', self.onerror, false );
			
			self.attached--;
			throw '載入圖像失敗: ' + url;
		}

	});

	function drawLoadingEffect(context, index, x, y, width, height){
		var 
			gradient = context.createLinearGradient(0,y,0,height+y),
			percent = index % height / height,
			color = '62,98,232';

		if(percent != 0){
			gradient.addColorStop(0, 'rgba('+color+','+(1-percent/2)+')');
			gradient.addColorStop(percent, 'rgba('+color+',1)');
		}
		gradient.addColorStop(percent, 'rgba('+color+',0.5)');
		gradient.addColorStop(1, 'rgba('+color+','+(1-percent/2)+')');
		context.save();
		context.fillStyle = gradient;
		context.fillRect(x, y, width, height);
		context.restore();
		gradient = null;
	}

	return ImageCache;

});