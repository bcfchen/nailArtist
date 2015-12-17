 (function () {
     angular.module('nailArtist')
  .directive('productDescContainer', function () {
      return {
          restrict: 'E',
          scope:{
          	product: "="
          },
          templateUrl: 'app/shared/directives/productDescriptionContainer/product-desc-container-template.html',
          link:function(scope){
          }
      }
  });
 })();