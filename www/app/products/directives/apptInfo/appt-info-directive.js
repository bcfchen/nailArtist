 (function () {
     angular.module('nailArtist')
  .directive('apptInfo', function () {
      return {
          restrict: 'E',
          scope:{
          	appointment: "="
          },
		  templatelUrl: "app/products/directives/apptInfo/appt-info-template.html",
          link:function(scope){
				scope.dateTime = getAppointmentDateTime(scope.appointment);

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
 })();
