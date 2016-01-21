 (function () {
     angular.module('nailArtist')
  .directive('newUserForm', function () {
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
		  templateUrl: 'app/bookings/directives/userInfoModal/newUserForm/new-user-form.html',
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
