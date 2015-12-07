(function(){
	'use strict';
	angular.module('nailArtist').controller("ProductsCtrl", ["$timeout", "$scope", "localStorageService", "userSelectionService", "$firebaseArray", "constants", "$ionicSlideBoxDelegate", "$state", ProductsCtrl]);

	function ProductsCtrl($timeout, $scope, localStorageService, userSelectionService, $firebaseArray, constants, $ionicSlideBoxDelegate, $state){
		var vm = this;
		var ref = new Firebase(constants.FIREBASE_URL + "/products");
		vm.products = $firebaseArray(ref);

		/* we're using caching for this page so that when we hit 
		 * "back" on other pages to return to this one, the slide position
		 * will maintain. however, if it's cached, then it won't know to update
		 * the view with appointment info if a recent booking is made. because
		 * of this, we'll detect when the view is entered and manually refresh
		 * appointment info */
        $scope.$on( "$ionicView.enter", function( scopes, states ) {
        	if( states.fromCache) {
			assignAppointmentInfo(vm.products);
            }
        });

		vm.products.$watch(function(event){
			$ionicSlideBoxDelegate.update();

			assignAppointmentInfo(vm.products);
			assignPurchaseDeadline(vm.products);
		});

		vm.toProductDetails = function(){
			userSelectionService.product = getCurrentProduct();
			$state.go("productDetails");
		};

		vm.contactUs = function(){
			$state.go("contactUs");
		}

		vm.bookAppointment = function(){
			userSelectionService.product = getCurrentProduct()
			var appointmentExists = userSelectionService.appointment && userSelectionService.appointment !== {};
			if(!appointmentExists){
				userSelectionService.appointment = new Appointment();
			}

			userSelectionService.appointment.setProductKey(userSelectionService.product.$id);

			$state.go("bookings");
		}

		vm.toSettings = function(){
			$state.go("settings");
		}

		/* private method implementation */

		function getAppointmentDateTime(appointment){
			if (!appointment){
				return;
			}

			var apptDate = appointment.schedule.date.replace(/-/g, '/');
			var scheduleObj = new moment(apptDate + " " + appointment.schedule.time);
			
			return {
				date: scheduleObj.format("MMM DD"),
				time: scheduleObj.format("h:mm A")
			}
		}

		function assignPurchaseDeadline(products){
			products.forEach(function(product){
				var productDeadline = product.deadline.replace(/-/g, '/');
				product.deadlineText = moment(productDeadline).fromNow();
			});
		}

		/* get all future appointments. if any one of them is for this current product, 
		 * then assign that to appointment property of the product
		*/
		function assignAppointmentInfo(products){
			localStorageService.cleanAppointments();
			var allAppointments = localStorageService.getAppointments();
			var currentProduct = getCurrentProduct();
			var existingAppointment = null;

			products.forEach(function(product){
				allAppointments.forEach(function(appointment){
					if (appointment.productKey === product.$id){
						product.appointment = appointment;
						product.dateTime = getAppointmentDateTime(appointment);
					}
				});
			});
		}

		function getCurrentProduct(){
			return vm.products[$ionicSlideBoxDelegate.currentIndex()];
		}
	}
})();