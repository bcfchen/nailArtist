(function () {

    angular
        .module("nailArtist")
        .factory("stripeService", ["$q", "$http", "constants", stripeService]);

    function stripeService($q, $http, constants) {
        var service = {
            open: open,
            initialize: initialize
        };

        var handler;

        initialize();

        return service;

        /* method implementations */
        function initialize(successCallback, errorCallback){
        	handler = StripeCheckout.configure({
			        image: "https://stripe.com/img/documentation/checkout/marketplace.png",
			        key:'pk_test_mxbGaMJiJcCqhShNWB1FFsZK',
			        token: function(response){
			        	tokenHandler(response, successCallback, errorCallback)
			        }
			});
        }

        function tokenHandler(response, successCallback, errorCallback){
			//successCallback(response);
			var card = response;
        	return $http.post(constants.SERVER_URL, card).then(successCallback, errorCallback);
        }

        function open(price){
        	handler.open({
	            name: 'Example Product',
	            description: 'Example Product ' + price,
	            amount: price
	        });
        }

    }
}());