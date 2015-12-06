(function(){
	'use strict';
	angular.module('nailArtist').controller("SettingsCtrl", ["policies", "$ionicPopup", "firebaseService", "$ionicHistory", "$scope", "$ionicModal", "localStorageService", "userSelectionService", "$state", SettingsCtrl]);

	function SettingsCtrl(policies, $ionicPopup, firebaseService, $ionicHistory, $scope, $ionicModal, localStorageService, userSelectionService, $state){
		var vm = this;
		vm.product = userSelectionService.product;
		vm.user = localStorageService.getUser();
		vm.selectedAddress = {};

		var selectedAddressType;

		vm.toContactUs = function(){
			$state.go("contactUs");
		}

		vm.goBack = function(){
			saveUser().then(function(){
				$ionicHistory.goBack();
			});
		}

		vm.editAddress = function(addressType){
			vm.selectedAddress = vm.user.addresses[addressType];
			$ionicPopup.show({
			    template: '<input type="text" placeholder="Street" ng-model="vm.selectedAddress.street">\n<input type="text" placeholder="City" ng-model="vm.selectedAddress.city">\n<input type="text" placeholder="State" ng-model="vm.selectedAddress.state">\n<input type="text" placeholder="ZIP" ng-model="vm.selectedAddress.zipCode">',
			    title: "Edit Address",
			    cssClass: 'myPopup',
			    scope: $scope,
			    buttons: [
			      {
			        text: '<b>Ok</b>',
			        type: 'button-energized',
			        onTap: function(e) {
			          if (!vm.selectedAddress ) {
			            //don't allow the user to close unless he enters a name
			            e.preventDefault();
			          } else {
			          	vm.user.addresses[addressType] = vm.selectedAddress;
			          	syncUserLocally();
			          }
			        }
			      }
		    	]
		  	});		}

		vm.editEmail = function(){
			$ionicPopup.show({
			    template: '<input type="text" ng-model="vm.user.email">',
			    title: "Edit Email",
			    cssClass: 'myPopup',
			    scope: $scope,
			    buttons: [
			      {
			        text: '<b>Ok</b>',
			        type: 'button-energized',
			        onTap: function(e) {
			          if (!vm.user.email) {
			            //don't allow the user to close unless he enters a name
			            e.preventDefault();
			          } else {
			          	syncUserLocally();
			          }
			        }
			      }
		    	]
		  	});
		}

		vm.editPhoneNumber = function(){
			$ionicPopup.show({
			    template: '<input type="text" ng-model="vm.user.phoneNumber">',
			    title: "Edit Phone Number",
			    cssClass: 'myPopup',
			    scope: $scope,
			    buttons: [
			      {
			        text: '<b>Ok</b>',
			        type: 'button-energized',
			        onTap: function(e) {
			          if (!vm.user.phoneNumber) {
			            //don't allow the user to close unless he enters a name
			            e.preventDefault();
			          } else {
			          	syncUserLocally();
			          }
			        }
			      }
		    	]
		  	});
		 }

		 vm.openPolicy = function(policyType){
		 	$scope.policyText = policies[policyType].text;
			$ionicPopup.show({
			    template: '<div>{{policyText}}</div>',
			    title: policies[policyType].title,
			     cssClass: 'myPopup',
			    scope: $scope,
			    buttons: [
			      {
			        text: '<b>Ok</b>',
			         // type: 'button-assertive',
			        onTap: function(e) {
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