function User(){
	this.name = "";
	this.addresses = {
		home: new Address(),
		work: new Address(),
		custom: new Address()
	};
	this.phoneNumber = "";
}

User.prototype.setName = function(name){
	this.name = name;
}

User.prototype.setPhoneNumber = function(phoneNumber){
	this.phoneNumber = phoneNumber;
}

User.prototype.setAddress = function(type, address){
	this.addresses[type] = address;
}