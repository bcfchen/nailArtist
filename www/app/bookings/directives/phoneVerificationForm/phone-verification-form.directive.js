 (function () {
     angular.module('nailArtist')
  .directive('phoneVerificationForm', function () {
      return {
          restrict: 'EA',
          scope:{
          	collection: "=",
            selectionType: "@",
            selectItem: "&",
            selectedItem: "=",
            upperTextProp: "@",
            lowerTextProp: "@"
          },
		  templateUrl: 'app/bookings/directives/phoneVerificationForm/phone-verification-form.html',
	      link: function(scope){
	          scope.onSelect = function(item){
	              if (item && scope.selectItem){
	                scope.selectItem({
	                  selection: item
	                });
	              }
	          }
	      }
      }
  });
 })();
