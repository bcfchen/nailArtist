/*
    Service to store the selected product
*/
(function() {
    'use strict';
    angular.module('nailArtist').value("userSelectionService", {
    	product: {},
    	appointment: null,
    	schedule: {}
    });
})();