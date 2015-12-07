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
            var stateExists = state !== null && state !== undefined;
            return stateExists && state.toUpperCase() === "CA";
        }

        function validateCity(city){
            var cityExists = city !== null && city !== undefined;
            return cityExists && city.toUpperCase() === "SAN FRANCISCO";
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