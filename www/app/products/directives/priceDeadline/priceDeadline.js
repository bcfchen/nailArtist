(function(currentScriptPath){

	angular.module("nailArtist").directive("priceDeadline", function(){
		return {
			//template: "<h4>TEST</h4>",
			restrict: 'E',
			scope:{
				product:"=" 
			},
			templatelUrl: currentScriptPath.replace('priceDeadline.js', 'priceDeadline.html'), //'priceDeadline.html',
			link: function(scope, elem, attr){
				assignPurchaseDeadline(scope.product);

				function assignPurchaseDeadline(product){
					var productDeadline = product.deadline.replace(/-/g, '/');
					product.deadlineText = moment(productDeadline).fromNow();
				}
			}
		}
	});
})((function(){
		var scripts = document.getElementsByTagName("script")
	var currentScriptPath = scripts[scripts.length-1].src;
	return currentScriptPath;
})());