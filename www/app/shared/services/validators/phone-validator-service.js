(function () {

    angular
        .module("nailArtist")
        .factory("phoneValidatorService", [phoneValidatorService]);

    function phoneValidatorService() {
        var service = {
            validate: validate
        };

        return service;

        /* method implementations */

        function validate(phoneNumber){
        	var isValid = false;
            phoneNumber = phoneNumber.replace(/\D/g,'');
			var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;

        	return PHONE_REGEXP.test(phoneNumber);
        }
    }
}());