//基本模型

SW.define('game/module/evaluation', function(require, exports, module){

	/* 按筆順分為4組
	A.二筆的有 4，5
	B.起筆Y增幅明顯大於X增幅的有 1，6
	C.起筆X增幅明顯大於Y增幅的有 2，3，7
	D.逆筆起筆的有 8，9
	*/
	var pointa = new Array(500);
	var pointb = new Array(500);
	var strokea = new Array(100);
	var strokeb = new Array(100);
	var benaa = new Array(100);
	var sa = 0;
	var sb = 0;
	var bena = new Array(10);
	var benb = new Array(100);

	var canvas = document.createElement('canvas');
	canvas.width = 1140;
	canvas.height = 684;
	var context = canvas.getContext('2d');
	document.body.appendChild(canvas);

	var length2 = function(x0, y0, x1, y1)
	{
		return (x0-x1)*(x0-x1) + (y0-y1)*(y0-y1);
	}

	var cross = function(x0, y0, x1, y1)
	{
		return x0*y1 - x1*y0;
	}

	return function (p, r, a)
	{

		var result = 0;
		var len = p.length;
		if(len < 7) return result == a;

		var xt = p[1];
		var yt = p[2];

		var k = 0;
		pointa[k++] = xt;
		pointa[k++] = yt;

		var point = pointa;
		var plena = 0;
		var plenb = 0;

		for(var i = 1; i < len; i++)
		{
			if('-' == p[i])
			{
				point = pointb;
				i++;
				plena = k;
				k = 0;
			}

			var x = p[i++];
			var y = p[i];

			if(length2(x, y, xt, yt) > 9 * r*r)
			{
				xt = x;
				yt = y;
				point[k++] = xt;
				point[k++] = yt;
			}

		}

		if(point == pointb) plenb = k;
		else plena = k;

		// context.fillStyle = '#000';
		// context.fillRect(0,0,1140,684);

		// for(var i = 0; i < plena; )
		// {
		// 	context.fillStyle = '#fff';
		// 	context.beginPath();
		// 	context.arc(pointa[i++], pointa[i++], 2, 0, Math.PI*2);
		// 	context.fill();
		// }
		// for(var i = 0; i < plenb; )
		// {
		// 	context.fillStyle = '#fff';
		// 	context.beginPath();
		// 	context.arc(pointb[i++], pointb[i++], 2, 0, Math.PI*2);
		// 	context.fill();
		// }

		sa = 0;
		if(2 == plena) benaa[0] = 0;
		else
		{
			var xt = pointa[2] - pointa[0];
			var yt = pointa[3] - pointa[1];

			var d = Math.sqrt(xt*xt + yt*yt);
			xt /= d;
			yt /= d;

			strokea[sa++] = xt;
			strokea[sa++] = yt;
			var x, y, s;
			for(var i = 2; i < plena - 2; i+=2)
			{
				x = pointa[2+i] - pointa[0+i];
				y = pointa[3+i] - pointa[1+i];

				d = Math.sqrt(x*x + y*y);
				x /= d;
				y /= d;

				s = 1 - (x*xt+y*yt);
				if(s > 0.21)
				{
					strokea[sa++] = x;
					strokea[sa++] = y;

					xt = x;
					yt = y;
				}
				else
				{
					xt = xt + x;
					yt = yt + y;
					d = Math.sqrt(xt*xt + yt*yt);
					xt /= d;
					yt /= d;
					strokea[sa-2] = xt;
					strokea[sa-1] = yt;
				}


			}

			sb = 0;
			if(plenb < 3) benb[0] = 0;
			else
			{
				var xt = pointb[2] - pointb[0];
				var yt = pointb[3] - pointb[1];

				var d = Math.sqrt(xt*xt + yt*yt);
				xt /= d;
				yt /= d;

				strokeb[sb++] = xt;
				strokeb[sb++] = yt;
				var x, y, s;
				for(var i = 2; i < plenb - 2; i+=2)
				{
					x = pointb[2+i] - pointb[0+i];
					y = pointb[3+i] - pointb[1+i];

					d = Math.sqrt(x*x + y*y);
					x /= d;
					y /= d;

					s = 1 - (x*xt+y*yt);
					if(s > 0.21)
					{
						strokeb[sb++] = x;
						strokeb[sb++] = y;

						xt = x;
						yt = y;
					}
					else
					{
						xt = xt + x;
						yt = yt + y;
						d = Math.sqrt(xt*xt + yt*yt);
						xt /= d;
						yt /= d;
						strokeb[sb-2] = xt;
						strokeb[sb-1] = yt;
					}


				}
			}

			// var pstrox = 350;
			// var pstroy = 300;
			// context.beginPath();
			// context.arc(pstrox, pstroy, 3, 0, Math.PI*2);
			// context.fill();

			// for(var i = 0; i < sa; )
			// {
			// 	context.fillStyle = '#6ff';
			// 	context.strokeStyle = '#ff0';
			// 	context.lineWidth = 2;

			// 	context.beginPath();
			// 	context.moveTo(pstrox, pstroy);
			// 	pstrox += strokea[i++]*100;
			// 	pstroy += strokea[i++]*100;
			// 	context.lineTo(pstrox, pstroy);
			// 	context.stroke();
			// 	context.closePath();
			// 	context.beginPath();
			// 	context.arc(pstrox, pstroy, 3, 0, Math.PI*2);
			// 	context.fill();

			// }

			// pstrox = 650;
			// pstroy = 300;
			// context.beginPath();
			// context.arc(pstrox, pstroy, 3, 0, Math.PI*2);
			// context.fill();

			// for(var i = 0; i < sb; )
			// {
			// 	context.fillStyle = '#6ff';
			// 	context.strokeStyle = '#ff0';
			// 	context.lineWidth = 2;

			// 	context.beginPath();
			// 	context.moveTo(pstrox, pstroy);
			// 	pstrox += strokeb[i++]*100;
			// 	pstroy += strokeb[i++]*100;
			// 	context.lineTo(pstrox, pstroy);
			// 	context.stroke();
			// 	context.closePath();
			// 	context.beginPath();
			// 	context.arc(pstrox, pstroy, 3, 0, Math.PI*2);
			// 	context.fill();

			// }

		}

		var  nBena = 0;
		for(var i = 0; i < sa - 2; i+=2)
		{
			if(cross(strokea[i], strokea[i+1], strokea[i+2], strokea[i+3]) > 0.01)
			{
				benaa[nBena++] = 1;
			}
			else
			{
				benaa[nBena++] = -1;
			}
		}

		var ntBen = 0;
		if(nBena > 0)
		{
			var tben = benaa[0];
			bena[ntBen++] = benaa[0];
			for(var i = 1; i < nBena; i++)
			{
				if(benaa[i] != tben)
				{
					tben = bena[ntBen++] = benaa[i];
				}
			}
		}



		if(sb > 0)
		{
			if(strokeb[1] > 0.7) result = 4;
			else if(strokeb[0] > 0.7) result = 5;
		}
		else if(1 == sa/2 && strokea[1] > 0.7) result = 1;
		else if(2 == sa/2 && strokea[0] > 0.7 && strokea[3] > 0.7 ) result = 7;
		else if(3 == sa/2)
		{
			if(strokea[0] > 0.7)
			{
				if( strokea[5] > 0.7) result = 7;
				else if(strokea[4] > 0.7) result = 2;
			}
			else
			{
				if(strokea[5]>0.5) result = 9;
				else if(strokea[5] < 0.3)
				{
					if(bena.length == 1) result = 6;
					else if(bena[1] == 1) result = 8;
				}
			}
		}
		else if( ntBen == 1)
			{
				if( bena[0] == -1) result = 6;
				else result = 8;
			}
		else if(ntBen == 3)
		{
			if( bena[0] == 1 ) result = 3;
			else result = 8;
		}
		else if(ntBen == 2)
		{
			if(bena[0] == 1)
			{
				if(strokea[sa-2] < 0) result = 8;
				else result = 2;
			}
			else
			{
				if(strokea[sa-2] < 0) result = 9;
				else result = 8;
			}
		}



		console.log(result);

		return result == a;
	};


});