(function(){
	'use strict';
	var module = angular.module('nailArtist');
	module.controller('CompleteCtrl', ["phoneValidatorService", "$ionicLoading", "TwilioVerification", "$scope", "localStorageService", "$ionicModal", "constants", "userSelectionService", "$state", "firebaseService", CompleteCtrl]);

	function CompleteCtrl(phoneValidatorService, $ionicLoading, TwilioVerification, $scope, localStorageService, $ionicModal, constants, userSelectionService, $state, firebaseService){
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
					userSelectionService.appointment.setUserPhone(vm.user.phoneNumber);
					$ionicLoading.show({
	                    content: 'Loading',
	                    animation: 'fade-in',
	                    showBackdrop: false,
	                    maxWidth: 200,
	                    showDelay: 0
	                });

					firebaseService.book(localStorageService.getUser(), userSelectionService.appointment, userSelectionService.schedule).then(function(){
						$ionicLoading.hide();
						$scope.apptConfirmedModal.show();
					}, function error(err){
							console.log("Booking failed with: ",  err);
							alert("Booking unsuccessful. Please try again later or contact RARE");
						});
				} else {
		    		$scope.nameNumberModal.show();
				}
			});
		}

		function sendText() {
			return TwilioVerification.sendCode(vm.user.phoneNumber, constants.TWILIO_MSG);
		}

		function initializeNameNumberModal(){
			return $ionicModal.fromTemplateUrl('app/complete/modals/name-number-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up',
		    		    backdropClickToClose: false

		  }).then(function(modal) {
		    $scope.nameNumberModal = modal;
		    var validPhoneNumber = true;
		    var validName = true;
			$scope.validNamePhoneNumber = true;
			$scope.errMsg = "";
		    $scope.nameNumberModal.done = function() {
		    	// check if name & number are valid. if not, do nothing
		    	var validPhoneNumber = phoneValidatorService.validate(vm.user.phoneNumber);
		    	var validName = vm.user.name && vm.user.name !== "";
		    	$scope.validNamePhoneNumber = validName && validPhoneNumber;
		    	if (!$scope.validNamePhoneNumber){
		    		$scope.errMsg = createErrMsg(validName, validPhoneNumber);
		    		return;
		    	}

		    	// use Twilio to verify the number 
		    	$scope.nameNumberModal.hide().then(function(){
					sendText().then(function success(){
						    		// launch modal to confirm phone number
						    		$scope.confirmPhoneModal.show();
						    	}, function error(){
						    		console.log("twilio failed to send text");
						    	});
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
			    	userSelectionService.appointment.setUserPhone(vm.user.phoneNumber);
			    	$ionicLoading.show({
	                    content: 'Loading',
	                    animation: 'fade-in',
	                    showBackdrop: false,
	                    maxWidth: 200,
	                    showDelay: 0
	                });
			    	firebaseService.book(localStorageService.getUser(), userSelectionService.appointment, userSelectionService.schedule).then(function(){
				    	$ionicLoading.hide();
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

		function createErrMsg(validName, validPhoneNumber){
			var msg = "Please enter valid ";
			if (!validName){
				msg += "name";
			}

			if (!validPhoneNumber){
				if (!validName){
					msg += " and ";
				}
				msg += "phone number";
			}

			return msg;
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