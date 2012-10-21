//基準測試

SW.define('modules/benchmark', function(require, exports, module){

	var testingItems = {
		'storage': function(){
			return 'localStorage' in window;
		}
	};

	return {
		testAll: function(handler){
			for(var key in testingItems){
				handler( key, testingItems[key]() );
			}
		},
		test: function(items, handler){
			for(var i=0, len=items.length; i<len; i++){
				if(items[i] in testingItems){
					handler( items[i], testingItems[items[i]]() );
				}
			}
		}
	};

});