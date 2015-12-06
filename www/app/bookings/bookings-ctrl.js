(function(){
	'use strict';
	angular.module('nailArtist').controller('BookingsCtrl', ["$ionicHistory", "localStorageService", "$ionicModal", "$scope", "$state", "userSelectionService", "$firebaseArray", "constants", "stripeService", BookingsCtrl]);

	function BookingsCtrl($ionicHistory, localStorageService, $ionicModal, $scope, $state, userSelectionService, $firebaseArray, constants, stripeService){
		var vm = this;
		vm.selectedDate = {};
		vm.selectedTime = {};
		vm.selectedAddress = {};
		vm.selectedAddressType = "";

		initialize();
		var ref = new Firebase(constants.FIREBASE_URL + "/schedule");
		var rawSchedule = $firebaseArray(ref);
		vm.schedule = [];
		rawSchedule.$loaded(function(dates){
			vm.schedule = processDateProperties(dates);
			vm.selectDate(vm.schedule[0]);
		});

		vm.goBack = function(){
			if (vm.showBookingContainer){
				$ionicHistory.goBack();
			} else {
				vm.showBookingContainer = true;
			}
		}

		vm.selectDate = function(date){
			vm.selectedDate = date.$id;
			vm.times = filterTimesOfDate(date); //Object.keys(date.times);
		}

		vm.selectTime = function(time){
			vm.selectedTime = time;
		}

		vm.selectAddress = function(type, address){
			var streetAddressExists = address && address.street && address.street != "";
			vm.selectedAddressType = type;
			vm.selectedAddress = address
			if (streetAddressExists){
			} else {
				vm.showBookingContainer = false;
			}
		}

		vm.bookAppointment = function(){
			// set selected schedule & address onto userSelectionService
			userSelectionService.schedule = new Schedule(vm.selectedDate, vm.selectedTime);
			userSelectionService.appointment.setAddress(vm.selectedAddress);
			userSelectionService.appointment.setSchedule(userSelectionService.schedule);
			stripeService.open(userSelectionService.product);
		}

		vm.toSettings = function(){
			$state.go("settings");
		}

		vm.closeEditAddress = function(){
			localStorageService.setUserAddress(vm.selectedAddressType, vm.selectedAddress);
			vm.showBookingContainer = true;
		}

		function initialize(){
			vm.showBookingContainer = true;
			vm.product = userSelectionService.product;
			vm.user = localStorageService.getUser();

			stripeService.initialize(stripeSuccessCallback, stripeErrorCallback);
		}

		function stripeSuccessCallback(response){
			console.log("payment success!", response);
			userSelectionService.appointment.setTransactionId(response.data.id);
			localStorageService.setUserEmail(response.data.source.name);
			$state.go("complete");
		}

		function stripeErrorCallback(err){
			console.log("payment failed with msg: ", err);
			alert("Your payment failed. Please try again");
		}

		function processDateProperties(dateObjs){
			var dates = [];
			for(var index in dateObjs){
				var dateObj = dateObjs[index];
				var dateInRange = isDateInRange(dateObj.$id);
				if (dateInRange){
					var dateStr = dateObj.$id.replace(/-/g, '/');
					var momentObj = new moment(dateStr);
					dateObj.dayOfWeek = momentObj.format("ddd");
					dateObj.monthDay = momentObj.format("MMM DD");
					dates.push(dateObj);
				}
			}

			return dates;
		}

		function filterTimesOfDate(date){
			// null check
			if (!date || !date.times){
				return [];
			}

			var filteredTimes = [];
			var timeStrings = Object.keys(date.times);
			timeStrings.forEach(function(time){
				var dateStr = date.$id.replace(/-/g, '/');
				var timeIsInRange = isTimeInRange(time, dateStr);
				if (timeIsInRange){
					filteredTimes.push(time);
				}
			});

			return filteredTimes;
		}

		function isTimeInRange(time, date){
			var now = new moment();
			var givenDateMoment = new moment(date);
			var givenTimeMoment = new moment(time);
			givenDateMoment.hour = givenTimeMoment.get('hour');
			givenDateMoment.minute = givenTimeMoment.get('minute');

			var isInRange = givenDateMoment > now;
			return isInRange;
		}

		function isDateInRange(dateStr){
			// check if the date object is even valid
			if (!dateStr){
				return false;
			}

			// compare dateObj with today's date to see if it's equal or after today
			var todaysMoment = new moment();
			var modDateStr = dateStr.replace(/-/g, '/');
			var dateObjMoment = new moment(modDateStr);
			var dateIsInRange = (dateObjMoment.year() >= todaysMoment.year())
								&& (dateObjMoment.dayOfYear() >= todaysMoment.dayOfYear());

			return dateIsInRange;			
		}
	};
})();