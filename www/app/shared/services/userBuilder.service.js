(function () {

    angular
        .module("nailArtist")
        .factory("userBuilder", [userBuilder]);

    function userBuilder() {
        var service = {
            setHomeAddress: setHomeAddress,
            setWorkAddress: setWorkAddress,
            setName: setName,
            setPhoneNumber: setPhoneNumber,
            setEmail: setEmail,
            build: build
        };

        var user;

        init();

        return service;

        /* method implementations */
        function init(){
            user = {};
        }

        function setHomeAddress(address){
        	user.addresses.home = address;
        }

        function setWorkAddress(address){
        	user.addresses.work = address;
        }

        function setName(name){
        	user.name = name;
        }

        function setPhoneNumber(phoneNumber){
        	user.phoneNumber = phoneNumber;
        }

        function setEmail(email){
        	user.email = email;
        }

        function build(){
        	return user;
        }

    }
}());