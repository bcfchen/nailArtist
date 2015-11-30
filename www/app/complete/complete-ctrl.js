(function(){
	'use strict';
	angular.module('nailArtist').controller('CompleteCtrl', ["constants", "userSelectionService", "$firebaseArray", CompleteCtrl]);

	function CompleteCtrl(constants, userSelectionService, $firebaseArray){
		var vm = this;
		vm.product = userSelectionService.product;

		// flag to display whether success or error module
		vm.bookingSuccessful = false;
	};
})();