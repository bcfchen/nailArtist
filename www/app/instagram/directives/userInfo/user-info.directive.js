 (function () {
     angular.module('nailArtist')
  .directive('userInfo', function () {
      return {
          restrict: 'E',
          scope:{
          	author: "="
          },
          templateUrl: 'app/instagram/directives/userInfo/user-info.html'
      }
  });
 })();