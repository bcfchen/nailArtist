(function(){
	'use strict';
	angular.module('nailArtist').controller('ProductDetailsCtrl', ["constants", "userSelectionService", "$firebaseArray", ProductDetailsCtrl]);

	function ProductDetailsCtrl(constants, userSelectionService, $firebaseArray){
		var vm = this;
		vm.product = userSelectionService.product;
		var ref = new Firebase(constants.FIREBASE_URL + "/instagram/" + vm.product.$id);
		vm.instagrams = $firebaseArray(ref);
	};
})();