(function(){
	'use strict';
	app.directive('tooltip', tooltip);

	function tooltip(){
		return {
			restrict: 'AE',
			link: function(scope, elem, attr){
				elem.hover(function(){
					//on mouse enter
					elem.tooltip('show');
				}, function(){
					//on mouse out
					elem.tooltip('hide');
				});
			}

		}
	}
})();