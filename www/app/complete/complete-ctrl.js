(function(){
	'use strict';
	angular.module('nailArtist').controller('CompleteCtrl', ["$ionicLoading", "TwilioVerification", "$scope", "localStorageService", "$ionicModal", "constants", "userSelectionService", "$state", "firebaseService", CompleteCtrl]);

	function CompleteCtrl($ionicLoading, TwilioVerification, $scope, localStorageService, $ionicModal, constants, userSelectionService, $state, firebaseService){
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
			initializeConfirmPhoneModal();
			initializeNameNumberModal().then(function(){
				return initializeAppointmentConfirmedModal();
			}).then(function(){
				/* if user's name and number already exist then don't show 
				   nameNumberModal, but instead save record directly to firebase
				*/
				if (vm.user.name && vm.user.phoneNumber){
					userSelectionService.appointment.userPhone = vm.user.phoneNumber;
					$ionicLoading.show({
	                    content: 'Loading',
	                    animation: 'fade-in',
	                    showBackdrop: false,
	                    maxWidth: 200,
	                    showDelay: 0
	                });

					firebaseService.book(localStorageService.getUser(), userSelectionService.appointment, userSelectionService.schedule).then(function(){
						$ionicLoading.hide();
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

		function sendText() {
			return TwilioVerification.sendCode(vm.user.phoneNumber);
		}

		function initializeNameNumberModal(){
			return $ionicModal.fromTemplateUrl('app/complete/modals/name-number-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up',
		    		    backdropClickToClose: false

		  }).then(function(modal) {
		    $scope.nameNumberModal = modal;
		    $scope.validNamePhoneNumber = true;

		    $scope.nameNumberModal.done = function() {
		    	// check if name & number are valid. if not, do nothing
		    	$scope.validNamePhoneNumber = vm.user.name && vm.user.phoneNumber;
		    	if (!$scope.validNamePhoneNumber){
		    		return;
		    	}

		    	// use Twilio to verify the number 
		    	sendText().then(function success(){
		    		// launch modal to confirm phone number
		    		$scope.confirmPhoneModal.show();
		    	}, function error(){
		    		console.log("twilio failed to send text");
		    	});
		  	}
		  });
		}

		function initializeConfirmPhoneModal(){
			return $ionicModal.fromTemplateUrl('app/complete/modals/confirm-phone-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up',
		    backdropClickToClose: false
		  }).then(function(modal) {
		    $scope.confirmPhoneModal = modal;
		    $scope.confirmPhoneModal.wrongCode = false;
		    $scope.confirmPhoneModal.confirm = function(){
		    	var verified = TwilioVerification.verifyCode($scope.confirmPhoneModal.securityCode);
		        if (verified) {
		            $scope.confirmPhoneModal.hide().then(function(){

			    	/* set input values */
			    	localStorageService.setUserName(vm.user.name);
			    	localStorageService.setUserPhoneNumber(vm.user.phoneNumber);
			    	userSelectionService.appointment.userPhone = vm.user.phoneNumber;
			    	$ionicLoading.show({
	                    content: 'Loading',
	                    animation: 'fade-in',
	                    showBackdrop: false,
	                    maxWidth: 200,
	                    showDelay: 0
	                });
			    	firebaseService.book(localStorageService.getUser(), userSelectionService.appointment, userSelectionService.schedule).then(function(){
				    	$ionicLoading.hide();
				    	localStorageService.addAppointment(userSelectionService.appointment);
				    	$scope.nameNumberModal.hide().then(function(){
				    		$scope.apptConfirmedModal.show();
				    	});
			    	});
		    		});
		        } else {
		           $scope.confirmPhoneModal.wrongCode = true;
		        }
		    }

		    $scope.confirmPhoneModal.resend = function() {
		    	/* reset wrongCode variable to false so that
				* next time this modal comes up it's not the error msg */
		    	$scope.confirmPhoneModal.hide().then(function(){
		    		$scope.confirmPhoneModal.wrongCode = false;
		    		$scope.nameNumberModal.show();
		    	});
		  	}
		  });
		}

		function initializeAppointmentConfirmedModal(){
			return $ionicModal.fromTemplateUrl('app/complete/modals/appt-confirmed-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up',
		    backdropClickToClose: false
		  }).then(function(modal) {
		    $scope.apptConfirmedModal = modal;
		    $scope.apptConfirmedModal.contactUs = function(){
		    	$scope.apptConfirmedModal.hide().then(function(){
		    		$state.go("contactUs");
		    	});
		    }

		    $scope.apptConfirmedModal.close = function() {
		    	$scope.apptConfirmedModal.hide().then(function(){
		    		$state.go("products");
		    	});
		  	}
		  });
		}
	};
})();