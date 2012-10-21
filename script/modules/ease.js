//緩沖計算
//計算中存在錯誤，目前只保證ease系列與cubic系列的計算是正確的

SW.define('modules/ease', function(require, exports, module){

	var Ease = {

		linear: function( percent ){
			return percent;
		},

		easeIn: function( percent ){
			return Math.pow( percent, 2 );
		},

		easeOut: function( percent ){
			return 1 - Math.pow( percent - 1, 2 );
		},

		cubicIn: function( percent ){
			return Math.pow( percent, 3 );
		},

		cubicOut: function( percent ){
			return Math.pow( percent - 1, 3 ) + 1;
		},

		quartIn: function( percent ){
			return Math.pow( percent, 4 );
		},

		quartOut: function( percent ){
			return Math.pow( percent - 1, 4 ) + 1;
		},

		quintIn: function( percent ){
			return Math.pow( percent, 5 );
		},

		quintOut: function( percent ){
			return Math.pow( percent - 1, 5 ) + 1;
		}

	};

	return function( ease, percent ){
		switch( ease.toLowerCase().replace(/\s/g,'') ){

			case 'easein':
				return Ease.easeIn( percent );

			case 'easeout':
				return Ease.easeOut( percent );

			case 'easeinout':
				if(percent>0.5){
					return Ease.easeOut(percent);
				}
				return Ease.easeIn(percent);

			case 'cubicin':
				return Ease.cubicIn( percent );

			case 'cubicout':
				return Ease.cubicOut( percent );

			case 'cubicinout':
				if(percent>0.5){
					return Ease.cubicOut(percent);
				}
				return Ease.cubicIn(percent);

			case 'quartin':
				return Ease.quartIn( percent );

			case 'quartout':
				return Ease.quartOut( percent );

			case 'quartinout':
				if(percent>0.5){
					return Ease.quartOut(percent);
				}
				return Ease.quartIn(percent);

			case 'quintin':
				return Ease.quintIn( percent );

			case 'quintout':
				return Ease.quintOut( percent );

			case 'quintinout':
				if(percent>0.5){
					return Ease.quintOut(percent);
				}
				return Ease.quintIn(percent);

			default:
				return Ease.linear( percent );

		}
	};

});