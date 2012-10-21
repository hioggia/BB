// 盒子計算

SW.define('modules/box', function(require, exports, module){

	var box = {

		composite: function( x1, y1, width1, height1, x2, y2, width2, height2 ){
			// 計算兩個box交集就是左端的最大值和右端最小值的差*最上端的最大值和最下端最小值 via ikkan
			var x = Math.max(x1, x2),
				y = Math.max(y1, y2),
				width = Math.min(x1 + width1, x2 + width2) - x,
				height = Math.min(y1 + height1, y2 + height2) - y;

			return { x: x, y: y, width: width, height: height };
		},

		contains: function( x, y, width, height, cellWidth, cellHeight ){

			var beginCol = Math.floor(x / cellWidth),
				beginRow = Math.floor(y / cellHeight),
				crossCol = Math.ceil((x + width - beginCol * cellWidth) / cellWidth),
				crossRow = Math.ceil((y + height - beginRow * cellHeight) / cellHeight);

			return { beginCol: beginCol, beginRow: beginRow, crossCol: crossCol, crossRow: crossRow };
			
		}

	};

	return box;

});