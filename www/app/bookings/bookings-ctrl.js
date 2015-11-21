(function(){
	'use strict';
	angular.module('nailArtist').controller('BookingsCtrl', ["$stateParams", "$firebaseArray", BookingsCtrl]);

	function BookingsCtrl($stateParams, $firebaseArray){
		var vm = this;
		var productId = $stateParams.productId;
	};
})();