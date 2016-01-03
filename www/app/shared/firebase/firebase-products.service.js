
(function() {
    'use strict';
    angular.module('nailArtist').factory("ProductsArray", ["$firebaseArray", ProductsArray]);

    function ProductsArray($firebaseArray) {
    	return $firebaseArray.$extend({
    		$$loaded: loaded,
    		$$added: added
    	});

        /* method implementations */
        function loaded(snapshots){
        	var products = [];
        	snapshots.forEach(function(snapshot){
        		products.push(new Product(snapshot));
        	});
        	
        	return products;
        }

        function added(snapshot){
        	return new Product(snapshot.val());
        }

    }
})();