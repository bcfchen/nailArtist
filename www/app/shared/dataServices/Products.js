
(function() {
    'use strict';
    angular.module('nailArtist').factory("Products", ["Product", Products]);

    function Products($firebaseArray) {
    	return $firebaseArray.$extend({
    		$$added: added
    	});

        /* method implementations */
        function added(snap){
        	return new Product(snap);
        }

    }
})();