 (function () {
     angular.module('nailArtist')
  .directive('priceDeadline', function () {
      return {
          restrict: 'E',
          scope:{
          	product: "=",
          	navFunction:"&"
          },
          templateUrl: 'app/products/directives/priceDeadline/price-deadline-template.html',
          link:function(scope){
          		var productDeadline = scope.product.deadline.replace(/-/g, '/');
				scope.product.deadlineText = moment(productDeadline).fromNow();
          	scope.onDownArrowClick = function(){
          		scope.navFunction();
          	}
          }
      }
  });
 })();