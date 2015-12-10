
	angular.module("nailArtist").directive("apptInfo", function(){
		return {
			templatelUrl: "www/app/products/directives/apptInfo/apptInfo.html",
			restrict: "E",
			scope:{
				appointment:"=" 
			},
			controller: function($scope){
				$scope.dateTime = getAppointmentDateTime($scope.appointment);

				function getAppointmentDateTime(appointment){
					if (!appointment || !appointment.schedule){
						return null;
					}

					var apptDate = appointment.schedule.date.replace(/-/g, '/');
					var scheduleObj = new moment(apptDate + " " + appointment.schedule.time);
					
					return {
						date: scheduleObj.format("MMM DD"),
						time: scheduleObj.format("h:mm A")
					}
			}
			}
		}
	});