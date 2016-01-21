
(function() {
    'use strict';
    angular.module('nailArtist').factory("ProductObject", ["$firebaseObject", ProductObject]);

    function ProductObject($firebaseObject) {
        return $firebaseObject.$extend({
            getProduct: getProduct
        });

        /* method implementations */
        function getProduct(){
            return this.$loaded().then(function(rawProduct){
                return new Product(rawProduct);
            });         
        }

    }
})();