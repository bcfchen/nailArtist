(function(){
	'use strict';
	angular.module('nailArtist').controller('CompleteCtrl', ["$scope", "localStorageService", "$ionicModal", "constants", "userSelectionService", "$state", "firebaseService", CompleteCtrl]);

	function CompleteCtrl($scope, localStorageService, $ionicModal, constants, userSelectionService, $state, firebaseService){
		var vm = this;
		vm.product = userSelectionService.product;
		vm.appointment = userSelectionService.appointment;

		// flag to display whether success or error module
		vm.bookingComplete = false;
		vm.bookingSuccessful = false;
		vm.user = localStorageService.getUser();
		var userRef, appointmentsRef;
		initialize();

		function initialize(){
			initializeNameNumberModal().then(function(){
				return initializeAppointmentConfirmedModal();
			}).then(function(){
				// if user's name and number already exist then don't show 
				if (vm.user.name && vm.user.phoneNumber){
					userSelectionService.appointment.userPhone = vm.user.phoneNumber;
					firebaseService.book(localStorageService.getUser(), userSelectionService.appointment, userSelectionService.schedule).then(function(){
						localStorageService.addAppointment(userSelectionService.appointment);
						$scope.apptConfirmedModal.show();
					}, function error(err){
							console.log("Booking failed with: ",  err);
							alert("Booking unsuccessful. Please try again later");
						});
				} else {
		    		$scope.nameNumberModal.show();
				}
			});
		}

		function initializeNameNumberModal(){
			return $ionicModal.fromTemplateUrl('app/complete/modals/name-number-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.nameNumberModal = modal;
		    $scope.nameNumberModal.done = function() {
		    	/* set input values */
		    	localStorageService.setUserName(vm.user.name);
		    	localStorageService.setUserPhoneNumber(vm.user.phoneNumber);
		    	userSelectionService.appointment.userPhone = vm.user.phoneNumber;
		    	firebaseService.book(localStorageService.getUser(), userSelectionService.appointment, userSelectionService.schedule).then(function(){
			    	localStorageService.addAppointment(userSelectionService.appointment);
			    	$scope.nameNumberModal.hide().then(function(){
			    		$scope.apptConfirmedModal.show();
			    	});
		    	});
		  	}
		  });
		}

		function initializeAppointmentConfirmedModal(){
			return $ionicModal.fromTemplateUrl('app/complete/modals/appt-confirmed-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.apptConfirmedModal = modal;
		    $scope.apptConfirmedModal.contactUs = function(){
		    	$scope.apptConfirmedModal.hide().then(function(){
		    		$state.go("contactUs");
		    	});
		    }

		    $scope.apptConfirmedModal.close = function() {
		    	$scope.apptConfirmedModal.hide().then(function(){
		    		vm.bookingComplete = true;
		    		vm.bookingSuccessful = true;	
		    	});
		  	}
		  });
		}
	};
})();