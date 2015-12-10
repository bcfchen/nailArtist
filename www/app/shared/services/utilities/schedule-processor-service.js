(function () {

    angular
        .module("nailArtist")
        .factory("scheduleProcessorService", ["constants", scheduleProcessorService]);

    function scheduleProcessorService(constants) {
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
                    dateObj.times = filterTimesOfDate(dateObj);
                    dateObj.available = isDateAvailable(dateObj);
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

        /* looks at the times under a date. 
         * if all times are unavailable then 
         * mark date as unavailable as well */
        function isDateAvailable(dateObj){
            // null check
            if (!dateObj.times){
                return false;
            }

            var available = false;
            Object.keys(dateObj.times).forEach(function(timeStr){
                var timeObj = dateObj.times[timeStr];
                if(timeObj.available){
                    available = true;
                }
            });

            return available;
        }

        function filterTimesOfDate(date){
            // null check
            if (!date || !date.times){
                return [];
            }

            var filteredTimes = [];
            var filteredTimeObjs = {};
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
                    filteredTimeObjs[timeStr] = timeObj;//filteredTimes.push(timeStr);
                }
            });

            return filteredTimeObjs;// filteredTimes;
        }

        function isTimeAvailable(timeObj){
            // null check
            if (!timeObj || !timeObj.numOfOpenings){
                return false;
            }

            /* check if number of appointments for this time
             * is greater/equal than number of openings for this time */
             if (!timeObj.appointments){
                timeObj.appointments = {};
             }
             
             var numOfAppointments = Object.keys(timeObj.appointments).length;
             if (numOfAppointments >= timeObj.numOfOpenings){
                return false;
             }

             return true;
        }

        function isTimeInRange(time, date){
            var now = new moment();
            var givenDateTimeMoment = new moment(date + " " + time);
            var isInRange = givenDateTimeMoment > now.add(constants.BUFFER_HOURS, "hours");
            return isInRange;
        }

    }
}());