(function(){
	'use strict';
	angular.module('nailArtist').controller("ProductsCtrl", ["$timeout", "$scope", "localStorageService", "userSelectionService", "$firebaseArray", "constants", "$ionicSlideBoxDelegate", "$state", ProductsCtrl]);

	function ProductsCtrl($timeout, $scope, localStorageService, userSelectionService, $firebaseArray, constants, $ionicSlideBoxDelegate, $state){
		var vm = this;
		var ref = new Firebase(constants.FIREBASE_URL + "/products");
		var rawProducts = $firebaseArray(ref);
		startWatch();
		/* we're using caching for this page so that when we hit 
		 * "back" on other pages to return to this one, the slide position
		 * will maintain. however, if it's cached, then it won't know to update
		 * the view with appointment info if a recent booking is made. because
		 * of this, we'll detect when the view is entered and manually refresh
		 * appointment info */
        $scope.$on( "$ionicView.enter", function( scopes, states ) {
        	if( states.fromCache) {
        		load();
			}
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

        function load(){
			rawProducts.$loaded(function(response){
				postProcessProducts(response);
			});
        }

        /* ionSlideBox has bug where if you're currently removing slide box items
         * from the left, it knows to go to next slide, but if you're removing slide
         * box items from the right, and you're on the item slide that's been removed,
         * then it'll give you a blank page. handling this by manually checking the 
         * slidebox index and slide to previous if necessary */
         function handleSlideboxIndex(rawProducts){
         	var shouldSlideToPrev = 
         	vm.products.length < rawProducts.length
         	&& $ionicSlideBoxDelegate.currentIndex() === vm.products.length;
         	if (shouldSlideToPrev){
         		$ionicSlideBoxDelegate.previous();
         	}
         }

        function startWatch(){
			rawProducts.$watch(function(event){
				postProcessProducts(rawProducts);
			});
        }

        function postProcessProducts(rawProducts){
    		vm.products = filterByAvailable(rawProducts);
			handleSlideboxIndex(rawProducts);
			$ionicSlideBoxDelegate.update();
			/* if user exists with valid phone number, check 
			 * to see if user has future appointments for specific products
			*/
			assignAppointmentInfo(vm.products);
        }

        function filterByAvailable(rawProducts){
			var products = [];
			rawProducts.forEach(function(rawProduct){
				if (rawProduct.available){
					products.push(rawProduct);
				}
			});

			return products;
        }

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

		/* get all future appointments. if any one of them is for this current product, 
		 * then assign that to appointment property of the product
		*/
		function assignAppointmentInfo(products){
			// if there is no user phone number stored, then don't bother
        	var userPhoneNumber = localStorageService.getUserPhoneNumber();
        	if (!userPhoneNumber){
        		return;
        	}

			var currentProduct = getCurrentProduct();
			var ref = new Firebase(constants.FIREBASE_URL + "/appointments/" + userPhoneNumber);
			vm.userAppointments = $firebaseArray(ref);
			vm.userAppointments.$loaded(function(){
				products.forEach(function(product){
					// reset product appointment/datetime info first
					product.appointment = null;
					product.dateTime = null;
					vm.userAppointments.forEach(function(appointment){
						var isFutureAppointment = appointment.productKey === product.$id 
												&& appointment.transactionId;
						if (isFutureAppointment){
							product.appointment = appointment;
							product.dateTime = getAppointmentDateTime(appointment);
						}
					});
				});			
			});
		}

		function getCurrentProduct(){
			return vm.products[$ionicSlideBoxDelegate.currentIndex()];
		}
	}
})();