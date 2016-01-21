 (function () {
     angular.module('nailArtist')
  .directive('newUserForm', function () {
      return {
          restrict: 'EA',
          scope:{
          	proceed:"&"
          },
		  templateUrl: 'app/bookings/directives/userInfoModal/newUserForm/new-user-form.html',
	      link: function(scope){
	          scope.onClick = function(item){
	              scope.proceed();
	          }
	      }
      }
  });
 })();
