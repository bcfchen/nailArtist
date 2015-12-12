 (function () {
     angular.module('nailArtist')
  .directive('apptInfo', function () {
      return {
          restrict: 'E',
          scope:{
          	appointments: "=",
          	product: "="
          },
		  templateUrl: 'app/products/directives/apptInfo/appt-info-template.html'
      }
  });
 })();
