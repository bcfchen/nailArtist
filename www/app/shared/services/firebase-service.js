(function () {

    angular
        .module("nailArtist")
        .factory("firebaseService", ["formatterService", "$q", "$firebaseObject", "$firebaseArray", "constants", firebaseService]);

    function firebaseService(formatterService, $q, $firebaseObject, $firebaseArray, constants) {
        var service = {
            book: book,
            saveUser: saveUser
        };

        return service;

        /* method implementations */

        function book(user, appointment, schedule){
        	return saveUser(user).then(saveAppointment(appointment, schedule));
        }

        function saveUser(user){
            var deferred = $q.defer();
        	var validUser = user && user.phoneNumber;

            if (validUser){
                user.phoneNumber = formatterService.formatPhoneNumber(user.phoneNumber);
            	var userRefUrl = constants.FIREBASE_URL + "/users/" + user.phoneNumber;
    			var userRef = new Firebase(userRefUrl);
    			var userObj = $firebaseObject(userRef);

    			userObj.name = user.name;
    			userObj.phoneNumber = user.phoneNumber;
    			userObj.addresses = user.addresses;
    			userObj.email = user.email;

    			userObj.$save().then(function(){
                    deferred.resolve();
                });
            } else {
                deferred.reject("User is invalid");
            }

            return deferred.promise;
        }

        function saveAppointment(appointment, schedule){
        	var appointmentsRefUrl = constants.FIREBASE_URL + "/schedule/" + schedule.date + "/times/" + schedule.time + "/appointments";
			var appointmentsRef = new Firebase(appointmentsRefUrl);
			var appointmentsArray = $firebaseArray(appointmentsRef);

			return appointmentsArray.$add(appointment);
        }

    }
}());