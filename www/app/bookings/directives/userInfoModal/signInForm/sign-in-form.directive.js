 (function () {
     angular.module('nailArtist')
  .directive('signInForm', function () {
      return {
          restrict: 'EA',
          scope:{
          	proceed:"&"
          },
		  templateUrl: 'app/bookings/directives/userInfoModal/signInForm/sign-in-form.html',
	      link: function(scope){
	          scope.onClick = function(){
	          	scope.proceed();
	          }
	      }
      }
  });
 })();
