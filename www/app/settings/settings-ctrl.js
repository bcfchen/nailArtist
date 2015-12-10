(function(){
	'use strict';
	angular.module('nailArtist').controller("SettingsCtrl", ["settingsValidatorService", "policies", "$ionicPopup", "firebaseService", "$ionicHistory", "$scope", "$ionicModal", "localStorageService", "userSelectionService", "$state", SettingsCtrl]);

	function SettingsCtrl(settingsValidatorService, policies, $ionicPopup, firebaseService, $ionicHistory, $scope, $ionicModal, localStorageService, userSelectionService, $state){
		var vm = this;
		vm.product = userSelectionService.product;
		vm.user = localStorageService.getUser();
		vm.selectedAddress = {};

		var selectedAddressType;

		vm.toContactUs = function(){
			$state.go("contactUs");
		}

		/* if user already entered phone number, we can save
		 * against firebase. else, since the data is already 
		 * in local storage, we can just go back */
		vm.goBack = function(){
			if (localStorageService.getUser().phoneNumber){
				saveUser().then(function(){
					$ionicHistory.goBack();
				});
			} else {
				$ionicHistory.goBack();
			}
		}

		vm.openBrowser = function(url){
			window.open(url, '_blank', 'location=yes'); 
			return false;
		}

		vm.editAddress = function(addressType){
			vm.selectedAddress = vm.user.addresses[addressType];
			$scope.isValidAddress = true;
			$ionicPopup.show({
			    template: '<input type="text" class="settings-address-input form-input" placeholder="Street" ng-model="vm.selectedAddress.street">\n<input type="text" class="settings-address-input form-input"  placeholder="City" ng-model="vm.selectedAddress.city">\n<input type="text" class="settings-address-input form-input"  placeholder="State" ng-model="vm.selectedAddress.state">\n<input type="text" class="settings-address-input form-input"  placeholder="ZIP" ng-model="vm.selectedAddress.zipCode"><div class="settings-validation-msg" ng-show="!isValidAddress">Please enter valid San Francisco address</div>',
			    title: "Edit Address",
			    cssClass: 'popup-vertical-buttons',
			    scope: $scope,
			    buttons: [
			      {
			        text: 'Done',
			        type: "primary-button",
			        onTap: function(e) {
			        $scope.isValidAddress = settingsValidatorService.validateAddress(vm.selectedAddress);
			          if (!$scope.isValidAddress ) {
			            //don't allow the user to close unless he enters a name
			            e.preventDefault();
			            cordova.plugins.Keyboard.close();
			          } else {
			          	vm.user.addresses[addressType] = vm.selectedAddress;
			          	syncUserLocally();
			          }
			        }
			      },
			      {
			        text: 'Cancel',
			        type: "dismiss-button",
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
			        text: 'Done',
			        type: "primary-button",
			        onTap: function(e) {
			        	$scope.isValidEmail = settingsValidatorService.validateEmail(vm.user.email);
			          if (!$scope.isValidEmail) {
			            //don't allow the user to close unless he enters a name
			            e.preventDefault();
			            cordova.plugins.Keyboard.close();
			          } else {
			          	syncUserLocally();
			          }
			        }
			      },
			      {
			        text: 'Cancel',
			        type: "dismiss-button",
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
			    template: '<input class="form-input" type="tel form-input" ng-model="vm.user.phoneNumber"><div class="settings-validation-msg" ng-show="!isValidPhoneNumber">Please enter valid phone number</div>',
			    title: "Edit Phone Number",
			    cssClass: 'popup-vertical-buttons',
			    scope: $scope,
			    buttons: [
			      {
			        text: 'Done',
			        type: "primary-button",
			        onTap: function(e) {
			          $scope.isValidPhoneNumber = settingsValidatorService.validatePhoneNumber(vm.user.phoneNumber);
			          if (!$scope.isValidPhoneNumber ) {
			            //don't allow the user to close unless he enters a name
			            e.preventDefault();
			          } else {
			          	syncUserLocally();
			          }
			        }
			      },
			      {
			        text: 'Cancel',
			        type: "dismiss-button",
			        onTap: function(e) {
			        	// revert to stored value
			        	vm.user.phoneNumber = localStorageService.getUser().phoneNumber;
			        }
			      }
		    	]
		  	});
		 }

		/* private function implementations */

		function syncUserLocally(){
			localStorageService.setUser(vm.user);
		}

		function saveUser(){
			return firebaseService.saveUser(localStorageService.getUser()).then(function success(){
			}, function error(){
				alert("Please enter valid phone number!");
			});
		}
	}
})();