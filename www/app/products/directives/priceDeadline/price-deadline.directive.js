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
            scope.product.isDeadlineUp = getIsDeadlineUp(scope.product);
            scope.product.deadlineText = getDeadlineText(scope.product);

          	scope.onDownArrowClick = function(){
          		scope.navFunction();
          	}

            function getIsDeadlineUp(product){
              var productDeadline = product.deadline.replace(/-/g, '/');
              var productDeadlineObj = moment(productDeadline + " " + "23:59:59");
              var daysFromToday = moment.duration(productDeadlineObj - new moment()).asDays();
                    return daysFromToday < 0;
            }

            function getDeadlineText(product){
              var productDeadline = product.deadline.replace(/-/g, '/');
              var productDeadlineObj = moment(productDeadline + " " + "23:59:59");
              return productDeadlineObj.fromNow();
            }
          }
      }
  });
 })();