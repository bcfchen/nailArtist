(function() {
    'use strict';
    angular.module('nailArtist').value('constants', {
    	FIREBASE_URL: "https://nailartist.firebaseio.com",
    	SERVER_URL: "https://morning-island-6861.herokuapp.com/charge",
    	BUFFER_HOURS: 2,
    	TWILIO_MSG: "Your RARE Nails verification code is "
    });
})();