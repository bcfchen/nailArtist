(function(){
	'use strict';
	angular.module('nailArtist').controller('BookingsCtrl', ["$ionicHistory", "localStorageService", "$ionicModal", "$scope", "$state", "userSelectionService", "$firebaseArray", "constants", "stripeService", BookingsCtrl]);

	function BookingsCtrl($ionicHistory, localStorageService, $ionicModal, $scope, $state, userSelectionService, $firebaseArray, constants, stripeService){
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

		vm.goBack = function(){
			if (vm.showBookingContainer){
				$ionicHistory.goBack();
			} else {
				vm.showBookingContainer = true;
			}
		}

		vm.selectDate = function(date){
			vm.selectedDate = date.$id;
			vm.times = Object.keys(date.times);
		}

		vm.selectTime = function(time){
			vm.selectedTime = time;
		}

		vm.selectAddress = function(type, address){
			var streetAddressExists = address.street && address.street != "";
			vm.selectedAddressType = type;
			vm.selectedAddress = address
			if (streetAddressExists){
			} else {
				vm.showBookingContainer = false;
			}
		}

		vm.bookAppointment = function(){
			// set selected schedule & address onto userSelectionService
			userSelectionService.schedule = new Schedule(vm.selectedDate, vm.selectedTime);
			userSelectionService.appointment.setAddress(vm.selectedAddress);
			userSelectionService.appointment.setSchedule(userSelectionService.schedule);
			stripeService.open(userSelectionService.product.price);
		}

		vm.toSettings = function(){
			$state.go("settings");
		}

		vm.closeEditAddress = function(){
			localStorageService.setUserAddress(vm.selectedAddressType, vm.selectedAddress);
			vm.showBookingContainer = true;
		}

		function initialize(){
			vm.showBookingContainer = true;
			vm.product = userSelectionService.product;
			vm.user = localStorageService.getUser();

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

		function attachDateProperties(dateObjs){
			for(var index in dateObjs){
				var dateObj = dateObjs[index];
				if (dateObj.$id){
					var dateStr = dateObj.$id.replace(/-/g, '/');
					var momentObj = new moment(dateStr);
					dateObjs[index].dayOfWeek = momentObj.format("ddd");
					dateObjs[index].monthDay = momentObj.format("MMM DD");
				}
			}
		}
	};
})();