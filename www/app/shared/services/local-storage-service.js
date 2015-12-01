(function() {
    'use strict';
    angular.module('nailArtist').factory('localStorageService', ['$window', 'transformer', function($window, transformer) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || null);
    },
    getUser: function() {
      return this.getObject("user") ? transformer.transform(this.getObject("user"), User) : new User();
    },
    setUser: function(value) {
      return this.setObject("user", value);
    },
    removeUser: function() {
      delete $window.localStorage["user"];
    },
    setUserAddress: function(type, address){
      var user = this.getUser();
      user.setAddress(type, address);
      this.setUser(user);
    },
    getUserPhoneNumber: function(){
      var phoneNumber = null;
      if (this.getUser()){
        phoneNumber = this.getUser().phoneNumber;
      }

      return phoneNumber;
    },
    setUserPhoneNumber: function(phoneNumber){
      var currObject = this.getUser();
      currObject.setPhoneNumber(phoneNumber);
      this.setUser(currObject);    
    },
    setUserName: function(name){
      var currObject = this.getUser();
      currObject.setName(name);
      this.setUser(currObject);    
    }

  }
  }]);
})();
