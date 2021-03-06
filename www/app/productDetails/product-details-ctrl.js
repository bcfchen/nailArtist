(function(){
	'use strict';
	angular.module('nailArtist').controller('ProductDetailsCtrl', ["$state", "constants", "userSelectionService", "$firebaseArray", ProductDetailsCtrl]);

	function ProductDetailsCtrl($state, constants, userSelectionService, $firebaseArray){
		var vm = this;
		vm.product = userSelectionService.product;
		var ref = new Firebase(constants.FIREBASE_URL + "/instagram/" + vm.product.$id);
		vm.instagrams = $firebaseArray(ref);

		vm.toProducts = function(){
			$state.go("products");
		}

		vm.bookAppointment = function(){
			var appointmentExists = userSelectionService.appointment && userSelectionService.appointment !== {};
			if(!appointmentExists){
				userSelectionService.appointment = new Appointment();
			}

			userSelectionService.appointment.setProductKey(userSelectionService.product.$id);
			$state.go("bookings");
		}
	};
})();