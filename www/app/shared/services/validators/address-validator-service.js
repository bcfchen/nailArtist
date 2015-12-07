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
        	var cityValid = validateCity(address.city);
        	var stateValid = validateState(address.state);
        	var zipValid = validateZipCode(address.zipCode);

        	return streetValid && cityValid && stateValid && zipValid;
        }

        function validateState(state){
            return state && state.toUpperCase() === "CA";
        }

        function validateCity(city){
            return city && city.toUpperCase() === "SAN FRANCISCO";
        }

        function validateZipCode(zipCode){
            var ZIP_REGEX = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
            return ZIP_REGEX.test(zipCode);
        }

        function isValidValue(value){
        	return value !== null && value !== undefined && value.length > 0;
        }
    }
}());