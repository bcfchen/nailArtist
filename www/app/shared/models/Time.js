function Time(){
	this.appointments = [];
	this.numOpenings = 0;
}

Time.prototype.getAppointments = function(){
	return this.appointments;
}

Time.prototype.setAppointments = function(appointments){
	this.appointments = appointments;
}

Time.prototype.getNumOpenings = function(){
	return this.numOpenings;
}