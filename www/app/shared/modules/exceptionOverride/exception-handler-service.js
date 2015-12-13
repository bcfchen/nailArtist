(function() {
    'use strict';
    angular.module('exceptionOverride').factory('exceptionHandler', ["$state", function($state) {
    return function(exception, cause) {
        exception.message += ' (caused by "' + cause + '")';
        $state.go("products");
        throw exception;
    };
  }]);
}());
