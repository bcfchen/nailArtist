(function(){
	'use strict';
	angular.module('nailArtist').controller("ProductsCtrl", ["localStorageService", "userSelectionService", "$firebaseArray", "constants", "$ionicSlideBoxDelegate", "$state", ProductsCtrl]);

	function ProductsCtrl(localStorageService, userSelectionService, $firebaseArray, constants, $ionicSlideBoxDelegate, $state){
		var vm = this;
		var ref = new Firebase(constants.FIREBASE_URL + "/products");
		vm.products = $firebaseArray(ref);
		vm.products.$loaded(function(){
			$ionicSlideBoxDelegate.update();
			assignAppointmentInfo(vm.products);
			//assignPurchaseDeadline(vm.products);
			// vm.existingAppointment = getExistingAppointment();
			// vm.appointmentDateTime = getAppointmentDateTime(vm.existingAppointment);
			// vm.purchaseDeadline = getPurchaseDeadline();
		});

		vm.toProductDetails = function(){
			userSelectionService.product = getCurrentProduct();
			$state.go("productDetails");
		};

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

		/* get all future appointments. if any one of them is for this current product, 
		 * then assign that to existingAppointment variable
		*/

		function getPurchaseDeadline(){
			var currentProduct = getCurrentProduct();

		}

		function getAppointmentDateTime(appointment){
			if (!appointment){
				return;
			}
			var scheduleObj = new moment(appointment.schedule.date + " " + appointment.schedule.time);
			
			return {
				date: scheduleObj.format("MMM DD"),
				time: scheduleObj.format("h:mm A")
			}
		}

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