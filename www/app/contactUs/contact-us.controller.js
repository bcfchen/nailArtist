(function(){
	'use strict';
	angular.module('nailArtist').controller("ContactUsCtrl", ["localStorageService", "userSelectionService", "$window", "$state", ContactUsCtrl]);

	function ContactUsCtrl(localStorageService, userSelectionService, $window, $state){
		var vm = this;
		vm.product = userSelectionService.product;
		var userPhoneNumber = localStorageService.getUserPhoneNumber() ? localStorageService.getUserPhoneNumber() : "";

		var SUPPORT_EMAIL = "friend@rarenails.co";
		vm.email = function(){
			var emailInfo = {
                to:          [SUPPORT_EMAIL], // email addresses for TO field
                subject:    "Quick question " + userPhoneNumber, // subject of the email
                body:       "",
                isHtml:    true, // indicats if the body is HTML or plain text
            }

			window.plugin.email.open(emailInfo , 
    		  	function () {},
            this);   
		}

		vm.goBack = function(){

		}
	}
})();