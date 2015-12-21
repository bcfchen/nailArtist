 (function () {
     angular.module('nailArtist')
  .directive('productInfoContainer', function () {
      return {
          restrict: 'E',
          scope:{
          	product: "="
          },
          templateUrl: 'app/instagram/directives/productInfoContainer/product-info-container.html'
      }
  });
 })();