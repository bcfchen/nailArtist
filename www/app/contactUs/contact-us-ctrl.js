(function(){
	'use strict';
	angular.module('nailArtist').controller("ContactUsCtrl", ["userSelectionService", "$window", "$state", ContactUsCtrl]);

	function ContactUsCtrl(userSelectionService, $window, $state){
		var vm = this;
		vm.product = userSelectionService.product;

		var SUPPORT_EMAIL = "nailArtist@gmail.com";
		vm.email = function(){
			var emailInfo = {
                to:          [SUPPORT_EMAIL], // email addresses for TO field
                subject:    "From your beloved user", // subject of the email
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