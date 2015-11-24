(function(){
	'use strict';
	angular.module('nailArtist').controller('BookingsCtrl', ["userSelectionService", "$firebaseArray", "constants",BookingsCtrl]);

	function BookingsCtrl(userSelectionService, $firebaseArray, constants){
		var vm = this;
		vm.selectedDate = {};
		vm.selectedTime = {};
		vm.selectedAddress = {};

		/* dummy address */
		vm.addresses = [{
			type: "Home",
			text: "One Harrison St"
		}, {
			type: "Work",
			text: "One Market St"
		}, {
			type: "Custom",
			text: "86 Malta Dr"
		}];

		initialize();
		var ref = new Firebase(constants.FIREBASE_URL + "/schedule");
		vm.schedule = $firebaseArray(ref);
		vm.schedule.$loaded(function(dates){
			attachDateProperties(dates);
			//vm.selectDate(dates[0]);
		});

		vm.selectDate = function(date){
			vm.selectedDate = date.$id;
			vm.times = Object.keys(date.times);
			//vm.selectTime(vm.times[0]);
		}

		vm.selectTime = function(time){
			vm.selectedTime = time;
		}

		vm.selectAddress = function(address){
			vm.selectedAddress = address;
		}

		function initialize(){
			vm.product = userSelectionService.product;
		}

		function attachDateProperties(dateObjs){
			for(var index in dateObjs){
				var dateObj = dateObjs[index];
				var momentObj = moment(dateObj.$id);
				dateObjs[index].dayOfWeek = momentObj.format("ddd");
				dateObjs[index].monthDay = momentObj.format("MMM DD");
			}
		}
	};
})();