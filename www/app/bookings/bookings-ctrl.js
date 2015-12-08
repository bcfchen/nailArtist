(function(){
	'use strict';
	angular.module('nailArtist').controller('BookingsCtrl', ["scheduleProcessorService", "addressValidatorService", "$ionicHistory", "localStorageService", "$ionicModal", "$scope", "$state", "userSelectionService", "$firebaseArray", "constants", "stripeService", BookingsCtrl]);

	function BookingsCtrl(scheduleProcessorService, addressValidatorService, $ionicHistory, localStorageService, $ionicModal, $scope, $state, userSelectionService, $firebaseArray, constants, stripeService){
		var vm = this;
		vm.selectedDate = {};
		vm.selectedTime = {};
		vm.selectedAddress = {};
		vm.selectedAddressType = "";

		initialize();
		var ref = new Firebase(constants.FIREBASE_URL + "/schedule");
		var rawSchedule = $firebaseArray(ref);
		var isFirstLoad = true;
		vm.schedule = [];

		rawSchedule.$watch(function(event){
			// only do this if we already have a selected date
			if (!isFirstLoad){
				var incomingObj = rawSchedule.$getRecord(event.key);
				vm.schedule = updateSchedule(vm.schedule, incomingObj);
				vm.schedule = scheduleProcessorService.processDateProperties(vm.schedule);
				var firstAvailableDate = _.find(vm.schedule, function(date){ return date.available === true});
				if (firstAvailableDate){
					vm.selectDate(firstAvailableDate);
				} else {
					vm.times = [];
				}
			}
		});

		rawSchedule.$loaded(function(dates){
			vm.schedule = scheduleProcessorService.processDateProperties(dates);
			var firstAvailableDate = _.find(vm.schedule, function(date){ return date.available === true});
			if (firstAvailableDate){
				vm.selectDate(firstAvailableDate);
			}
			isFirstLoad = false;
		});

		vm.goBack = function(){
			if (vm.showBookingContainer){
				$ionicHistory.goBack();
			} else {
				vm.showBookingContainer = true;
			}
		}

		vm.selectDate = function(date){
			vm.selectedDate = date.$id;
			// 
			vm.times = date.times; 
			vm.selectedTime = null;
		}

		vm.selectTime = function(time){
			vm.selectedTime = time;
		}

		vm.selectAddress = function(type, address){
			var streetAddressExists = address && address.street && address.street != "";
			vm.selectedAddressType = type;
			vm.selectedAddress = address
			if (streetAddressExists){
			} else {
				vm.showBookingContainer = false;
				$scope.editAddressModal.show();
			}
		}

		vm.bookAppointment = function(){
			// set selected schedule & address onto userSelectionService
			userSelectionService.schedule = new Schedule(vm.selectedDate, vm.selectedTime.$id);
			userSelectionService.appointment.setAddress(vm.selectedAddress);
			userSelectionService.appointment.setSchedule(userSelectionService.schedule);
			stripeService.initialize(userSelectionService.product.price, stripeSuccessCallback, stripeErrorCallback);
			stripeService.open(userSelectionService.product);
		}

		vm.toSettings = function(){
			$state.go("settings");
		}

		function initialize(){
			vm.showBookingContainer = true;
			vm.product = userSelectionService.product;
			vm.user = localStorageService.getUser();
			initializeEditAddressModal();
		}

		function updateSchedule(currentDateObjs, newDateObj){
			var existingDateObj = _.find(currentDateObjs, function(dateObj){
				return dateObj.$id === newDateObj.$id;
			});

			if (existingDateObj){
				existingDateObj = newDateObj;
			} else {
				currentDateObjs.push(newDateObj);
			}

			return currentDateObjs;
		}

		function initializeEditAddressModal(){
			return $ionicModal.fromTemplateUrl('app/bookings/modals/edit-address-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.editAddressModal = modal;
		    $scope.isAddressValid = true;
		    $scope.editAddressModal.done = function() {
		    	/* perform validation to check if values are populated */
		    	$scope.isAddressValid = addressValidatorService.validate(vm.selectedAddress);
		    	if ($scope.isAddressValid){
		    		localStorageService.setUserAddress(vm.selectedAddressType, vm.selectedAddress);
					$scope.editAddressModal.hide();
		    	}
			 }

			 $scope.$on('modal.hidden', function(){
			 	/* reset selected address property to whatever's stored in local storage. this is */
				/* to handle when user clicks cancel and we dont want to display whatever he put  */
				/* in the edit address modal before cancelling out								  */
				var storedAddress = localStorageService.getUserAddresses()[vm.selectedAddressType];
				setAddressFields(vm.selectedAddress, storedAddress);
				setAddressFields(vm.user.addresses[vm.selectedAddressType], storedAddress);
			 	vm.showBookingContainer = true;
			 });
		  });
		}

		function setAddressFields(address1, address2){
			address1.street = address2.street;
			address1.city = address2.city;
			address1.state = address2.state;
			address1.zipCode = address2.zipCode;
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

	};
})();