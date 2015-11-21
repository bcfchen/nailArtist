(function(){
	'use strict';
	angular.module('nailArtist').controller('ProductDetailsCtrl', ["$stateParams", "$firebaseArray", ProductDetailsCtrl]);

	function ProductDetailsCtrl($stateParams, $firebaseArray){
		var vm = this;
		var productId = $stateParams.productId;
	};
})();