(function () {

    angular
        .module("nailArtist")
        .factory("stripeService", ["$ionicLoading", "$q", "$http", "constants", stripeService]);

    function stripeService($ionicLoading, $q, $http, constants) {
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
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });			

            // hackaround to get around checkout.js bug
             delete window.StripeCheckout
              var script = document.createElement('script')
              script.src="https://checkout.stripe.com/checkout.js"
              document.body.appendChild(script)

            var card = response;
        	return $http.post(constants.SERVER_URL, card).then(function success(response){successCallback(response);}, 
                    function error(err){errorCallback(err);})
                .finally(function(){
                    $ionicLoading.hide();
                });
        }

        function open(product){
        	handler.open({
	            name: 'RARE',
	            description: product.name,
	            amount: product.price * 100
	        });
        }

    }
}());