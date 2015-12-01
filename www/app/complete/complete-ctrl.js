(function(){
	'use strict';
	angular.module('nailArtist').controller('CompleteCtrl', ["$scope", "localStorageService", "$ionicModal", "constants", "userSelectionService", "$firebaseArray", CompleteCtrl]);

	function CompleteCtrl($scope, localStorageService, $ionicModal, constants, userSelectionService, $firebaseArray){
		var vm = this;
		vm.product = userSelectionService.product;

		// flag to display whether success or error module
		vm.bookingComplete = false;
		vm.bookingSuccessful = false;
		vm.user = localStorageService.getUser();

		initialize();

		function initialize(){
			initializeNameNumberModal();
			initializeReminderModal();
			initializeAppointmentConfirmedModal();
		}

		function initializeNameNumberModal(){
			$ionicModal.fromTemplateUrl('app/complete/modals/name-number-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.nameNumberModal = modal;
		    $scope.nameNumberModal.show();
		    $scope.nameNumberModal.done = function() {
		    	/* set input values */
		    	localStorageService.setUserName(vm.user.name);
		    	localStorageService.setUserPhoneNumber(vm.user.phoneNumber);
		    	$scope.nameNumberModal.hide().then(function(){
		    		$scope.reminderModal.show();
		    	});
		  	}
		  });
		}

		function initializeReminderModal(){
			$ionicModal.fromTemplateUrl('app/complete/modals/reminder-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.reminderModal = modal;
		    $scope.reminderModal.done = function() {
		    	/* set input values */
		    	// localStorageService.setUserName(vm.user.name);
		    	// localStorageService.setUserPhoneNumber(vm.user.phoneNumber);
		    	$scope.reminderModal.hide().then(function(){
		    		$scope.apptConfirmedModal.show();
		    	});
		  	}
		  });
		}

		function initializeAppointmentConfirmedModal(){
			$ionicModal.fromTemplateUrl('app/complete/modals/appt-confirmed-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.apptConfirmedModal = modal;
		    $scope.apptConfirmedModal.contactUs = function(){
		    	$scope.apptConfirmedModal.hide();
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