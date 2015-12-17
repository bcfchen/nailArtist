(function () {

    angular
        .module("nailArtist")
        .factory("addressValidatorService", [addressValidatorService]);

    function addressValidatorService() {
        var service = {
            validate: validate
        };

        var SF_ZIPCODES = [94102,94103,94104,94105,94107,94108,94109,94110,94111,94114,94115,94117,94118,94121,94122,94123,94129,94133,94158];

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
            if (!zipCode){
                return false;
            }

            return SF_ZIPCODES.indexOf(Number(zipCode)) > -1;
        }

        function isValidValue(value){
        	return value !== null && value !== undefined && value.length > 0;
        }
    }
}());