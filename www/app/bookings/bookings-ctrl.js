(function(){
	'use strict';
	angular.module('nailArtist').controller('BookingsCtrl', ["localStorageService", "$ionicModal", "$scope", "$state", "userSelectionService", "$firebaseArray", "constants", "stripeService", BookingsCtrl]);

	function BookingsCtrl(localStorageService, $ionicModal, $scope, $state, userSelectionService, $firebaseArray, constants, stripeService){
		var vm = this;
		vm.selectedDate = {};
		vm.selectedTime = {};
		vm.selectedAddress = {};
		vm.selectedAddressType = "";

		initialize();
		var ref = new Firebase(constants.FIREBASE_URL + "/schedule");
		vm.schedule = $firebaseArray(ref);
		vm.schedule.$loaded(function(dates){
			attachDateProperties(dates);
			//vm.selectDate(dates[0]);
		});

		vm.selectDate = function(date){
			vm.selectedDate = date.$id;
			vm.times = Object.keys(date.times);
			//vm.selectTime(vm.times[0]);
		}

		vm.selectTime = function(time){
			vm.selectedTime = time;
		}

		vm.selectAddress = function(type, address){
			var streetAddressExists = address.street && address.street != "";
			vm.selectedAddressType = type;
			vm.selectedAddress = address
			if (streetAddressExists){
				// vm.selectedAddress = address;
			} else {
				toggleModalVisibility(false, true);
			}
		}

		vm.bookAppointment = function(){
			// set selected schedule & address onto userSelectionService
			userSelectionService.appointment.setAddress(vm.selectedAddress);
			userSelectionService.schedule = new Schedule(vm.selectedDate, vm.selectedTime);
			stripeService.open(userSelectionService.product.price);
		}

		function initialize(){
			vm.showBookingContainer = true;
			vm.product = userSelectionService.product;
			vm.user = localStorageService.getUser();

			initializeEditAddressModal();
			stripeService.initialize(stripeSuccessCallback, stripeErrorCallback);
		}

		function stripeSuccessCallback(response){
			console.log("payment success!", response);
			userSelectionService.appointment.setTransactionId(response.data.id);
			localStorageService.setUserEmail(response.data.source.name);
			$state.go("complete");
		}

		function stripeErrorCallback(err){
			console.log("payment failed with msg: ", err);
			alert("Your payment failed. Please try again");
		}

		function initializeEditAddressModal(){
			$ionicModal.fromTemplateUrl('app/bookings/modals/edit-address-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.editAddressModal = modal;
		    $scope.editAddressModal.done = function() {
		    	localStorageService.setUserAddress(vm.selectedAddressType, vm.selectedAddress);
		    	toggleModalVisibility(true, false);
		  	}
		  });
		}

		function toggleModalVisibility(showBookingContainer, showEditAddress){
			if(showEditAddress){
				vm.showBookingContainer = showBookingContainer;
				$scope.editAddressModal.show();
			} else {
				$scope.editAddressModal.hide().then(function(){
					vm.showBookingContainer = showBookingContainer;
				});
			}
			// vm.showBookingContainer = showBookingContainer;

		}

		function attachDateProperties(dateObjs){
			for(var index in dateObjs){
				var dateObj = dateObjs[index];
				var dateStr = dateObj.$id.replace(/-/g, '/');
				var momentObj = new moment(dateStr);
				dateObjs[index].dayOfWeek = momentObj.format("ddd");
				dateObjs[index].monthDay = momentObj.format("MMM DD");
			}
		}
	};
})();