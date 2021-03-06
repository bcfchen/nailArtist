// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nailArtist', ['ionic', 'firebase', 'ngCordova', 'mcwebb.twilio', 'mcwebb.twilio-verification'])

.run(function($ionicPlatform, $window) {
  $ionicPlatform.ready(function() {
    // resolve white screen in between splash & app screen
    if (navigator && navigator.splashscreen){
        navigator.splashscreen.hide();
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider, TwilioProvider, TwilioVerificationProvider) {

    // override default page transitions
    $ionicConfigProvider.views.transition("none");

    // setup Twilio 
    TwilioProvider.setCredentials({
        accountSid: 'AC8b36caff6e2efe2cc52ba9c3adca65aa',
        authToken: 'd7487cf487722e6167895d74e11a70d0'
    });

    TwilioVerificationProvider.setFromNumber('+14152756413');

    // setup routing
    $stateProvider
    .state('products', {
        url: '/products',
        templateUrl: 'app/products/products.html',
        cache: true
    }).state('productDetails', {
        url: '/productDetails',
        templateUrl: 'app/productDetails/product-details.html',
        cache: false
    }).state('bookings', {
        url: '/bookings',
        templateUrl: 'app/bookings/bookings.html',
        cache: false
    }).state('complete', {
        url: '/complete',
        templateUrl: 'app/complete/complete.html',
        cache: false
    }).state('contactUs', {
        url: '/contactUs',
        templateUrl: 'app/contactUs/contact-us.html'
    }).state('settings', {
        url: '/settings',
        templateUrl: 'app/settings/settings.html',
        cache: false
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/products');
});
