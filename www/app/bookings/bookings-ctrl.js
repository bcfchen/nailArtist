(function(){
	'use strict';
	angular.module('nailArtist').controller('BookingsCtrl', ["localStorageService", "$ionicModal", "$scope", "$state", "userSelectionService", "$firebaseArray", "constants",BookingsCtrl]);

	function BookingsCtrl(localStorageService, $ionicModal, $scope, $state, userSelectionService, $firebaseArray, constants){
		var vm = this;
		vm.selectedDate = {};
		vm.selectedTime = {};
		vm.selectedAddress = {};

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

		vm.selectAddress = function(address){
			if (address){
				vm.selectedAddress = address;
			} else {
				toggleModalVisibility(false, true);
			}
		}

		vm.bookAppointment = function(){
			$state.go("complete");
		}

		function initialize(){
			vm.showBookingContainer = true;
			vm.product = userSelectionService.product;
			vm.user = localStorageService.getUser();

			initializeEditProfileModal();
		}

		function initializeEditProfileModal(){
			$ionicModal.fromTemplateUrl('app/bookings/modals/edit-address-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.editAddressModal = modal;
		    $scope.editAddressModal.done = function() {
		    	/* set input values */
		    	// $localstorage.setUserNickname(vm.nickname);
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
				var momentObj = moment(dateObj.$id);
				dateObjs[index].dayOfWeek = momentObj.format("ddd");
				dateObjs[index].monthDay = momentObj.format("MMM DD");
			}
		}
	};
})();