function Appointment(){
	this.userPhone = "";
	this.available = false;
	this.transactionId = "";
	this.productKey = "";
	this.address = "";
	this.schedule = "";
}

Appointment.prototype.setUserPhone = function(phone){
	this.userPhone = phone
}

Appointment.prototype.setAvailable = function(available){
	this.available = available;
}

Appointment.prototype.setTransactionId = function(transactionId){
	this.transactionId = transactionId;
}

Appointment.prototype.setProductKey = function(productKey){
	this.productKey = productKey;
}

Appointment.prototype.setAddress = function(address){
	this.address = address;
}

Appointment.prototype.setSchedule = function(schedule){
	this.schedule = schedule;
}