(function () {

    angular
        .module("nailArtist")
        .factory("settingsValidatorService", ["addressValidatorService", settingsValidatorService]);

    function settingsValidatorService(addressValidatorService) {
        var service = {
            validatePhoneNumber: validatePhoneNumber, 
            validateAddress: validateAddress,
            validateEmail: validateEmail
        };

        return service;

        /* method implementations */

        function validatePhoneNumber(phoneNumber){
        	var isValid = false;
			var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;

        	return PHONE_REGEXP.test(phoneNumber);
        }

        function validateAddress(address){
        	return addressValidatorService.validate(address);
        }

        function validateEmail(email){
        	var EMAIL_REGEXP = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        	return EMAIL_REGEXP.test(email);
        }
    }
}());