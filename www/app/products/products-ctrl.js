(function(){
	'use strict';
	angular.module('nailArtist').controller("ProductsCtrl", ["$firebaseArray", "constants", "$ionicSlideBoxDelegate", "$state", ProductsCtrl]);

	function ProductsCtrl($firebaseArray, constants, $ionicSlideBoxDelegate, $state){
		var vm = this;
		var ref = new Firebase(constants.FIREBASE_URL + "/products");
		vm.products = $firebaseArray(ref);
		vm.products.$loaded(function(){
			$ionicSlideBoxDelegate.update();
		});

		vm.onSwipeUp = function(){
			var currentProduct = getCurrentProduct();
			$state.go("productDetails", {"productId": currentProduct.$id});
		};

		vm.bookAppointment = function(){
			var currentProduct = getCurrentProduct();
			$state.go("bookings", {"productId": currentProduct.$id});
		}

		function getCurrentProduct(){
			return vm.products[$ionicSlideBoxDelegate.currentIndex()];
		}
	}
})();