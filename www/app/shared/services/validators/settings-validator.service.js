(function () {

    angular
        .module("nailArtist")
        .factory("settingsValidatorService", ["phoneValidatorService", "addressValidatorService", settingsValidatorService]);

    function settingsValidatorService(phoneValidatorService, addressValidatorService) {
        var service = {
            validatePhoneNumber: validatePhoneNumber, 
            validateAddress: validateAddress,
            validateEmail: validateEmail
        };

        return service;

        /* method implementations */

        function validatePhoneNumber(phoneNumber){
        	return phoneValidatorService.validate(phoneNumber);
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