(function(){
	'use strict';
	angular.module('nailArtist').controller("SettingsCtrl", ["$scope", "$ionicModal", "localStorageService", "userSelectionService", "$state", SettingsCtrl]);

	function SettingsCtrl($scope, $ionicModal, localStorageService, userSelectionService, $state){
		var vm = this;
		vm.product = userSelectionService.product;
		vm.user = localStorageService.getUser();
		vm.selectedAddress = {};

		var selectedAddressType;

		initialize();

		vm.goBack = function(){

		}

		vm.editAddress = function(addressType){
			selectedAddressType = addressType;
			vm.selectedAddress = vm.user.addresses[addressType];
			$scope.editAddressModal.show();
		}

		vm.editEmail = function(){
			$scope.editEmailModal.show();
		}

		vm.editPhoneNumber = function(){
			$scope.editPhoneNumberModal.show();
		}

		/* private function implementations */

		function initialize(){
			initializeAddressModal();
			initializeEmailModal();
			initializePhoneNumberModal();
		}

		function initializeAddressModal(){
			$ionicModal.fromTemplateUrl('app/settings/modals/settings-address-modal.html', {
			    scope: $scope,
			    animation: 'slide-in-up'
			  }).then(function(modal) {
			    $scope.editAddressModal = modal;
			    $scope.editAddressModal.done = function() {
			    	vm.user.addresses[selectedAddressType] = vm.selectedAddress;
			    	syncUser();
			    	$scope.editAddressModal.hide();
			  	}
			  	$scope.editAddressModal.cancel = function() {
			    	$scope.editAddressModal.hide();
			  	}
			  });
		}
		
		function initializeEmailModal(){
			$ionicModal.fromTemplateUrl('app/settings/modals/settings-email-modal.html', {
			    scope: $scope,
			    animation: 'slide-in-up'
			  }).then(function(modal) {
			    $scope.editEmailModal = modal;
			    $scope.editEmailModal.done = function() {
			    	syncUser();
			    	$scope.editEmailModal.hide();
			  	}
			  	$scope.editEmailModal.cancel = function() {
			    	$scope.editEmailModal.hide();
			  	}
			  });
		}

		function initializePhoneNumberModal(){
			$ionicModal.fromTemplateUrl('app/settings/modals/settings-phone-number-modal.html', {
			    scope: $scope,
			    animation: 'slide-in-up'
			  }).then(function(modal) {
			    $scope.editPhoneNumberModal = modal;
			    $scope.editPhoneNumberModal.done = function() {
			    	syncUser();
			    	$scope.editPhoneNumberModal.hide();
			  	}
			  	$scope.editPhoneNumberModal.cancel = function() {
			    	$scope.editPhoneNumberModal.hide();
			  	}
			  });
		}

		function syncUser(){
			localStorageService.setUser(vm.user);
		}
	}
})();