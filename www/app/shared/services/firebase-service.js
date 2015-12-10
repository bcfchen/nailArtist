(function () {

    angular
        .module("nailArtist")
        .factory("firebaseService", ["$q", "$firebaseObject", "$firebaseArray", "constants", firebaseService]);

    function firebaseService($q, $firebaseObject, $firebaseArray, constants) {
        var service = {
            book: book,
            saveUser: saveUser
        };

        return service;

        /* method implementations */

        function book(user, appointment, schedule){
        	return saveUser(user).then(addAppointmentToUser(user, appointment)).then(saveAppointment(appointment, schedule));
        }

        function saveUser(user){
            var deferred = $q.defer();
        	var validUser = user && user.phoneNumber;

            if (validUser){
            	var userRefUrl = constants.FIREBASE_URL + "/users/" + user.phoneNumber;
    			var userRef = new Firebase(userRefUrl);
    			var userObj = $firebaseObject(userRef);

    			userObj.name = user.name;
    			userObj.phoneNumber = user.phoneNumber;
    			userObj.addresses = user.addresses;
    			userObj.email = user.email;

    			userObj.$save().then(function(){
                    deferred.resolve(user);
                });
            } else {
                deferred.reject("User is invalid");
            }

            return deferred.promise;
        }

        function addAppointmentToUser(user, appointment){
            var userAppointmentsRefUrl = constants.FIREBASE_URL + "/appointments/" + user.phoneNumber;
            var userAppointmentsRef = new Firebase(userAppointmentsRefUrl);
            var userAppointmentsArray = $firebaseArray(userAppointmentsRef);
            return userAppointmentsArray.$add(appointment);
        }

        function saveAppointment(appointment, schedule){
        	var appointmentsRefUrl = constants.FIREBASE_URL + "/schedule/" + schedule.date + "/times/" + schedule.time + "/appointments";
			var appointmentsRef = new Firebase(appointmentsRefUrl);
			var appointmentsArray = $firebaseArray(appointmentsRef);

			return appointmentsArray.$add(appointment);
        }

    }
}());