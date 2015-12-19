 (function () {
     angular.module('nailArtist')
  .directive('settingsAddressItem', function () {
      return {
          restrict: 'E',
          scope:{
          	address: "=",
            addressType: "@",
            label: "@",
          	editAddress: "&"
          },
		  templateUrl: 'app/settings/directives/settingsAddressItem/settings-address-item.html',
		  link: function(scope){
		  	scope.onClick = function(){
		  		scope.editAddress({
		  			addressType: scope.addressType
		  		});
		  	}
		  }
      }
  });
 })();
