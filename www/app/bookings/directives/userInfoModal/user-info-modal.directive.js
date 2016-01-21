 (function () {
     angular.module('nailArtist')
  .directive('userInfoModal', ["userBuilder", function (userBuilder) {
      return {
          restrict: 'EA',
          scope:{
          	closeUserInfo: "&",
          	verify: "&"
          },
		  templateUrl: 'app/bookings/directives/userInfoModal/user-info-modal.html',
	      link: function(scope){
	      	  scope.isNewUser = true;

	      	  scope.toggleIsNewUser = function(isNewUser){
	      	  	scope.isNewUser = isNewUser;
	      	  }

	      	  scope.displayPhoneVerification = function(){
	      	  	scope.verify();
	      	  }

	          scope.onSelect = function(item){
	              if (item && scope.selectItem){
	                scope.selectItem({
	                  selection: item
	                });
	              }
	          }

	          scope.exit = function(){
	          	scope.closeUserInfo();
	          }
	      }
      }
  }]);
 })();
