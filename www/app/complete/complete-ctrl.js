(function(){
	'use strict';
	angular.module('nailArtist').controller('CompleteCtrl', ["$scope", "localStorageService", "$ionicModal", "constants", "userSelectionService", "$firebaseArray", "$state", CompleteCtrl]);

	function CompleteCtrl($scope, localStorageService, $ionicModal, constants, userSelectionService, $firebaseArray, $state){
		var vm = this;
		vm.product = userSelectionService.product;
		vm.appointment = userSelectionService.appointment;

		// flag to display whether success or error module
		vm.bookingComplete = false;
		vm.bookingSuccessful = false;
		vm.user = localStorageService.getUser();
		var usersRef, appointmentsRef;
		initialize();

		function initialize(){
			initializeFirebaseReferences();
			initializeNameNumberModal().then(function(){
				return initializeAppointmentConfirmedModal();
			}).then(function(){
				// if user's name and number already exist then don't show 
				if (vm.user.name && vm.user.phoneNumber){
					$scope.apptConfirmedModal.show();
				} else {
		    		$scope.nameNumberModal.show();
				}
			});
		}

		function save(){
			saveUserInfo();
			saveAppointment();
		}

		function initializeFirebaseReferences(){
			usersRef = constants.FIREBASE_URL + "/users";
			appointmentsRef = constants.FIREBASE_URL + "/schedule/" + userSelectionService.schedule.date + "/times/" + userSelectionService.schedule.time + "/appointments";
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
		    	$scope.nameNumberModal.hide().then(function(){
		    		$scope.apptConfirmedModal.show();
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