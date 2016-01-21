(function () {

    angular
        .module("nailArtist")
        .factory("appointmentBuilder", [appointmentBuilder]);

    function appointmentBuilder() {
        var service = {
            setAddress: setAddress,
            setDate: setDate,
            setTime: setTime,
            setUserId: setUserId,
            setProductId: setProductId,
            setTransactionId: setTransactionId,
            build: build
        };

        var appointment;

        initialize();

        return service;

        /* method implementations */
        function initialize(){
            appointment = {};
        }

        function setAddress(address){
        	appointment.address = address;
        }

        function setDate(date){
        	appointment.date = date;
        }

        function setTime(time){
        	appointment.time = time;
        }

        function setUserId(userId){
        	appointment.userId = userId;
        }

        function setProductId(productId){
        	appointment.productId = productId;
        }

        function setTransactionId(transactionId){
        	appointment.transactionId = transactionId;
        }

        function build(){
        	return appointment;
        }

    }
}());