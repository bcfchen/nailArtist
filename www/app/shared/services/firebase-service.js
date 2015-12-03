(function () {

    angular
        .module("nailArtist")
        .factory("firebaseService", ["$firebaseObject", "$firebaseArray", "constants", firebaseService]);

    function firebaseService($firebaseObject, $firebaseArray, constants) {
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
        	var invalidUser = !user || !user.phoneNumber;
        	if (invalidUser){
        		throw new Error("Invalid user");
        	}

        	var userRefUrl = constants.FIREBASE_URL + "/users/" + user.phoneNumber;
			var userRef = new Firebase(userRefUrl);
			var userObj = $firebaseObject(userRef);

			userObj.name = user.name;
			userObj.phoneNumber = user.phoneNumber;
			userObj.addresses = user.addresses;

			return userObj.$save();
        }

        function saveAppointment(appointment, schedule){
        	var appointmentsRefUrl = constants.FIREBASE_URL + "/schedule/" + schedule.date + "/times/" + schedule.time + "/appointments";
			var appointmentsRef = new Firebase(appointmentsRefUrl);
			var appointmentsArray = $firebaseArray(appointmentsRef);

			return appointmentsArray.$add(appointment);
        }

    }
}());