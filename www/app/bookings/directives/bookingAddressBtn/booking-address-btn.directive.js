 (function () {
     angular.module('nailArtist')
  .directive('bookingAddressBtn', function () {
      return {
          restrict: 'EA',
          scope:{
          	address: "=",
            selectedAddress: "=",
            selectAddress: "&",
            label: "@"
          },
		  templateUrl: 'app/bookings/directives/bookingAddressBtn/booking-address-btn.html',
      link: function(scope){
          onSelect = function(addressType, address){
              if (addressType && address && scope.selectAddress){
                scope.selectAddress({
                  type: addressType,
                  address: address
                });
              }
          }
      }
      }
  });
 })();
