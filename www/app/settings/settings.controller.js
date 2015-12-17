(function(){
	'use strict';
	angular.module('nailArtist').controller("SettingsCtrl", ["constants", "TwilioVerification", "$q", "settingsValidatorService", "$ionicPopup", "firebaseService", "$ionicHistory", "$scope", "$ionicModal", "localStorageService", "userSelectionService", "$state", SettingsCtrl]);

	function SettingsCtrl(constants, TwilioVerification, $q, settingsValidatorService, $ionicPopup, firebaseService, $ionicHistory, $scope, $ionicModal, localStorageService, userSelectionService, $state){
		var vm = this;
		vm.product = userSelectionService.product;
		vm.user = localStorageService.getUser();
		vm.selectedAddress = {};
		vm.blurBackground = false;

		var selectedAddressType;
		initializeConfirmPhoneModal();

		vm.toContactUs = function(){
			$state.go("contactUs");
		}

		/* if user already entered phone number, we can save
		 * against firebase. else, since the data is already 
		 * in local storage, we can just go back */
		vm.goBack = function(){
			$ionicHistory.goBack();
		}

		vm.openBrowser = function(url){
			window.open(url, '_system', 'location=yes'); 
			return false;
		}

		vm.editAddress = function(addressType){
			vm.selectedAddress = vm.user.addresses[addressType];
			$scope.isValidAddress = true;
			$ionicPopup.show({
			    template: '<div class="settings-address-msg">Currently serving select neighborhoods in San Francisco</div><input type="text" class="settings-address-input form-input" placeholder="Street" ng-model="vm.selectedAddress.street">\n<input type="text" class="settings-address-input form-input" disabled="true" placeholder="{{vm.selectedAddress.city}}">\n<input type="text" class="settings-address-input form-input" disabled="true" placeholder="{{vm.selectedAddress.state}}">\n<input type="text" class="settings-address-input form-input"  placeholder="ZIP" ng-model="vm.selectedAddress.zipCode"><div class="settings-validation-msg" ng-show="!isValidAddress">**This address is out of our service area. Contact us to learn more</div>',
			    title: "Edit Address",
			    cssClass: 'popup-vertical-buttons',
			    scope: $scope,
			    buttons: [
			      {
			        text: 'Save',
			        type: "btn primary-btn",
			        onTap: function(e) {
			        $scope.isValidAddress = settingsValidatorService.validateAddress(vm.selectedAddress);
			          if (!$scope.isValidAddress ) {
			            //don't allow the user to close unless he enters a name
			            e.preventDefault();
			            cordova.plugins.Keyboard.close();
			          } else {
			          	vm.user.addresses[addressType] = vm.selectedAddress;
			          	saveUser();
			          }
			        }
			      },
			      {
			        text: 'Cancel',
			        type: "btn dismiss-btn",
			        onTap: function(e) {
			        	// revert to stored value
			        	vm.user.addresses[addressType] = localStorageService.getUser().addresses[addressType];
			        	vm.selectedAddress = localStorageService.getUser().addresses[addressType];
			        }
			      }
		    	]
		  	});		
		}

		vm.editEmail = function(){
			$scope.isValidEmail = true;
			$ionicPopup.show({
			    template: '<input class="form-input" type="email" ng-model="vm.user.email"><div class="settings-validation-msg" ng-show="!isValidEmail">Please enter valid email</div>',
			    title: "Edit Email",
			    cssClass: 'popup-vertical-buttons',
			    scope: $scope,
			    buttons: [
			      {
			        text: 'Save',
			        type: "btn primary-btn",
			        onTap: function(e) {
			        	$scope.isValidEmail = settingsValidatorService.validateEmail(vm.user.email);
			          if (!$scope.isValidEmail) {
			            //don't allow the user to close unless he enters a name
			            e.preventDefault();
			            cordova.plugins.Keyboard.close();
			          } else {
			          	saveUser();
			          }
			        }
			      },
			      {
			        text: 'Cancel',
			        type: "btn dismiss-btn",
			        onTap: function(e) {
			        	// revert to stored value
			        	vm.user.email = localStorageService.getUser().email;
			        }
			      }
		    	]
		  	});
		}

		vm.editPhoneNumber = function(){
			$scope.isValidPhoneNumber = true;
			$ionicPopup.show({
			    template: '<input class="form-input" type="tel" ng-model="vm.user.phoneNumber"><div class="settings-validation-msg" ng-show="!isValidPhoneNumber">Please enter valid phone number</div>',
			    title: "Edit Phone Number",
			    cssClass: 'popup-vertical-buttons',
			    scope: $scope,
			    buttons: [
			      {
			        text: 'Save',
			        type: "btn primary-btn",
			        onTap: function(e) {
			          $scope.isValidPhoneNumber = settingsValidatorService.validatePhoneNumber(vm.user.phoneNumber);
			          if (!$scope.isValidPhoneNumber ) {
			            //don't allow the user to close unless he enters a name
			            e.preventDefault();
			          } else {
			          	vm.blurBackground = true;
			          	sendText().then(function(){
							$scope.confirmPhoneModal.show();
			          	});
			          }
			        }
			      },
			      {
			        text: 'Cancel',
			        type: "btn dismiss-btn",
			        onTap: function(e) {
			        	// revert to stored value
			        	vm.user.phoneNumber = localStorageService.getUser().phoneNumber;
			        	vm.blurBackground = false;
			        }
			      }
		    	]
		  	});
		 }

		/* private function implementations */

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
			    	saveUser().then(
			    		function saveSuccess(){
			    			vm.blurBackground = false;
			    		}, function saveFailed(err){
			    			console.log(err);
			    			alert("Your info cannot be saved at this time. Please try again later");
			    			vm.blurBackground = false;
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
		    		vm.editPhoneNumber();
		    	});
		  	}
		  });
		}

		function sendText() {
			return TwilioVerification.sendCode(vm.user.phoneNumber, constants.TWILIO_MSG);
		}

		function syncUserLocally(){
			localStorageService.setUser(vm.user);
		}

		function saveUser(){
			var deferred = $q.defer();
			syncUserLocally();

			/* if user provided phone, then save to firebase
			 * else only save locally with the line above
			*/
			if (vm.user.phoneNumber){
				firebaseService.saveUser(localStorageService.getUser()).then(function success(){
					deferred.resolve();
				}, function error(err){
					deferred.reject(err);
				});
			} else {
				deferred.resolve();
			}

			return deferred.promise;
		}
	}
})();