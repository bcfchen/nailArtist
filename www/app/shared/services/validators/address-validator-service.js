(function () {

    angular
        .module("nailArtist")
        .factory("addressValidatorService", [addressValidatorService]);

    function addressValidatorService() {
        var service = {
            validate: validate
        };

        return service;

        /* method implementations */

        function validate(address){
        	var isValid = false;
        	var streetValid = isValidValue(address.street);
        	var cityValid = isValidValue(address.city);
        	var stateValid = isValidValue(address.state);
        	var zipValid = isValidValue(address.zipCode);

        	return streetValid && cityValid && stateValid && zipValid;
        }

        function isValidValue(value){
        	return value !== null && value !== undefined && value.length > 0;
        }
    }
}());