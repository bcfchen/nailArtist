(function(){
	'use strict';
	angular.module('nailArtist').controller('BookingsCtrl', ["$stateParams", "$firebaseArray", "constants",BookingsCtrl]);

	function BookingsCtrl($stateParams, $firebaseArray, constants){
		var vm = this;
		var productId = $stateParams.productId;
		vm.selectedDate = {};
		vm.selectedTime = {};

		var ref = new Firebase(constants.FIREBASE_URL + "/schedule");
		vm.schedule = $firebaseArray(ref);
		vm.schedule.$loaded(function(date){
			vm.selectDate(date[0]);
		});

		vm.selectDate = function(date){
			vm.selectedDate = date.$id;
			vm.times = Object.keys(date.times);
		}

		vm.selectTime = function(time){

		}
	};
})();