function Appointment(){
	this.userPhone = "";
	this.transactionId = "";
	this.productKey = "";
	this.address = "";
	this.schedule = "";
	this.cancelled = false;
}

Appointment.prototype.setUserPhone = function(phone){
	var formattedPhone = phone ? phone.toString().replace(/\D+/g, '') : null;
	this.userPhone = formattedPhone
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

Appointment.prototype.isInFuture = function(){
	var apptDate = this.schedule.date.replace(/-/g, '/');
	var appointmentDateTimeObj = new moment(apptDate + " " + this.schedule.time);
	return appointmentDateTimeObj > new moment();
}

