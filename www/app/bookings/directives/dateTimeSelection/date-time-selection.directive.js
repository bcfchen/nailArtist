 (function () {
     angular.module('nailArtist')
  .directive('dateTimeSelection', ["appointmentBuilder", function (appointmentBuilder) {
      return {
          restrict: 'EA',
          scope:{
          	bookAppointment: bookAppointment
          },
		  templateUrl: 'app/bookings/directives/dateTimeSelection/date-time-selection.html',
	      link: function(scope){


	        scope.onClick = function(){
                scope.bookAppointment({
                  appointment: appointmentBuilder.build()
                });
	          }
	      }
      }
  }]);
 })();
