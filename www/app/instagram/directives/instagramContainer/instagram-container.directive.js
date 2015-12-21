 (function () {
     angular.module('nailArtist')
  .directive('instagramContainer', function () {
      return {
          restrict: 'E',
          scope:{
          	instagram: "="
          },
          templateUrl: 'app/instagram/directives/instagramContainer/instagram-container.html'
      }
  });
 })();