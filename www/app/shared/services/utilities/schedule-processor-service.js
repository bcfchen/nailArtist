(function () {

    angular
        .module("nailArtist")
        .factory("scheduleProcessorService", [scheduleProcessorService]);

    function scheduleProcessorService() {
        var service = {
            processDateProperties: processDateProperties,
            filterTimesOfDate: filterTimesOfDate
        };

        return service;

        /* method implementations */

        function processDateProperties(dateObjs){
            var dates = [];
            for(var index in dateObjs){
                var dateObj = dateObjs[index];
                var dateInRange = isDateInRange(dateObj.$id);
                if (dateInRange){
                    var dateStr = dateObj.$id.replace(/-/g, '/');
                    var momentObj = new moment(dateStr);
                    dateObj.dayOfWeek = momentObj.format("ddd");
                    dateObj.monthDay = momentObj.format("MMM DD");
                    dates.push(dateObj);
                }
            }

            return dates;
        }

        function isDateInRange(dateStr){
            // check if the date object is even valid
            if (!dateStr){
                return false;
            }

            // compare dateObj with today's date to see if it's equal or after today
            var todaysMoment = new moment();
            var modDateStr = dateStr.replace(/-/g, '/');
            var dateObjMoment = new moment(modDateStr);
            var dateIsInRange = (dateObjMoment.year() >= todaysMoment.year())
                                && (dateObjMoment.dayOfYear() >= todaysMoment.dayOfYear());

            return dateIsInRange;           
        }

        function filterTimesOfDate(date){
            // null check
            if (!date || !date.times){
                return [];
            }

            var filteredTimes = [];
            var filteredTimeObjs = [];
            var timeObjs = date.times;
            var timeStrings = Object.keys(timeObjs);

            timeStrings.forEach(function(timeStr){
                var dateStr = date.$id.replace(/-/g, '/');
                var timeObj = timeObjs[timeStr];
                timeObj.$id = timeStr;
                var timeIsAvailable = isTimeAvailable(timeObj);
                var timeIsInRange = isTimeInRange(timeStr, dateStr);
                if (timeIsInRange){
                    timeObj.available = isTimeAvailable(timeObj);
                    filteredTimeObjs.push(timeObj);//filteredTimes.push(timeStr);
                }
            });

            return filteredTimeObjs;// filteredTimes;
        }

        function isTimeAvailable(timeObj){
            var numOfOpenings = timeObj.numOpenings;
            // null check
            if (!timeObj || !timeObj.appointments || !timeObj.numOfOpenings){
                return false;
            }

            /* check if number of appointments for this time
             * is greater/equal than number of openings for this time */
             if (timeObj.appointments.length >= timeObj.numOpenings){
                return false;
             }

             return true;
        }

        function isTimeInRange(time, date){
            var now = new moment();
            var givenDateMoment = new moment(date);
            var givenTimeMoment = new moment(time);
            givenDateMoment.hour = givenTimeMoment.get('hour');
            givenDateMoment.minute = givenTimeMoment.get('minute');

            var isInRange = givenDateMoment > now;
            return isInRange;
        }

    }
}());