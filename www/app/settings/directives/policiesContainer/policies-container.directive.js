 (function () {
     angular.module('nailArtist')
  .directive('policiesContainer', ["constants", function (constants) {
      return {
          restrict: 'E',
          scope:{
          	openPolicy: "&"
          },
		  templateUrl: 'app/settings/directives/policiesContainer/policies-container.html',
		  link: function(scope){
		  	scope.onClick = function(policyType){
		  		var policyPageUrl = "";
		  		if (policyType === "privacy"){
		  			policyPageUrl = constants.PRIVACY_POLICY_URL;
		  		} else {
		  			policyPageUrl = constants.CANCELLATION_POLICY_URL;
		  		}

				scope.openPolicy({
					url: policyPageUrl
				});
		  	}
		  }
      }
  }]);
 })();
