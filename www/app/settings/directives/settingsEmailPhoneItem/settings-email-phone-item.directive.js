 (function () {
     angular.module('nailArtist')
  .directive('settingsEmailPhoneItem', function () {
      return {
          restrict: 'E',
          scope:{
          	contact: "=",
            label: "@",
          	editInfo: "&"
          },
		  templateUrl: 'app/settings/directives/settingsEmailPhoneItem/settings-email-phone-item.html',
		  link: function(scope){
		  	scope.onClick = function(){
		  		scope.editInfo();
		  	}
		  }
      }
  });
 })();
