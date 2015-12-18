 (function () {
     angular.module('nailArtist')
  .directive('scrollSelector', function () {
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
		  templateUrl: 'app/bookings/directives/scrollSelector/scroll-selector.html',
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
