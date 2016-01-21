 (function () {
     angular.module('nailArtist')
  .directive('userInfoModal', function () {
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
		  templateUrl: 'app/bookings/directives/userInfoModal/user-info-modal.html',
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
