(function(){
	'use strict';
	angular.module('nailArtist').controller("ProductsCtrl", ["userSelectionService", "$firebaseArray", "constants", "$ionicSlideBoxDelegate", "$state", ProductsCtrl]);

	function ProductsCtrl(userSelectionService, $firebaseArray, constants, $ionicSlideBoxDelegate, $state){
		var vm = this;
		var ref = new Firebase(constants.FIREBASE_URL + "/products");
		vm.products = $firebaseArray(ref);
		vm.products.$loaded(function(){
			$ionicSlideBoxDelegate.update();
		});

		vm.toProductDetails = function(){
			userSelectionService.product = getCurrentProduct();
			$state.go("productDetails");
		};

		vm.bookAppointment = function(){
			userSelectionService.product = getCurrentProduct()
			var appointmentExists = userSelectionService.appointment && userSelectionService.appointment !== {};
			if(!appointmentExists){
				userSelectionService.appointment = new Appointment();
			}

			userSelectionService.appointment.setProductKey(userSelectionService.product.$id);

			$state.go("bookings");
		}

		function getCurrentProduct(){
			return vm.products[$ionicSlideBoxDelegate.currentIndex()];
		}
	}
})();