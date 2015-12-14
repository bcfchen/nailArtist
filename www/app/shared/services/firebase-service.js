(function () {

    angular
        .module("nailArtist")
        .factory("firebaseService", ["$q", "$firebaseObject", "$firebaseArray", "constants", firebaseService]);

    function firebaseService($q, $firebaseObject, $firebaseArray, constants) {
        var service = {
            book: book,
            saveUser: saveUser
        };

        var lastTransactionId = null;

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
            var deferred = $q.defer();
            var userAppointmentsRefUrl = constants.FIREBASE_URL + "/appointments/" + user.phoneNumber;
            var userAppointmentsRef = new Firebase(userAppointmentsRefUrl);
            var userAppointmentsArray = $firebaseArray(userAppointmentsRef);
            /* de-duping on transactionId after seeing strange issue with
             * duplicate records with same transactionId created in 
             * firebaseDB*/
            if (appointment.transactionId === lastTransactionId){
                    deferred.resolve();
            } else {
                userAppointmentsArray.$add(appointment).then(function success(){
                    lastTransactionId = appointment.transactionId;
                    deferred.resolve();
                });            
            }

            return deferred.promise;
        }

        function saveAppointment(appointment, schedule){
            var deferred = $q.defer();
        	var appointmentsRefUrl = constants.FIREBASE_URL + "/schedule/" + schedule.date + "/times/" + schedule.time + "/appointments";
			var appointmentsRef = new Firebase(appointmentsRefUrl);
			var appointmentsArray = $firebaseArray(appointmentsRef);
            /* de-duping on transactionId after seeing strange issue with
             * duplicate records with same transactionId created in 
             * firebaseDB*/
            if (appointment.transactionId === lastTransactionId){
                deferred.resolve();
            } else {
                appointmentsArray.$add(appointment).then(function success(){
                    lastTransactionId = appointment.transactionId;
                    deferred.resolve();
                });
            }

            return deferred.promise;
        }

    }
}());