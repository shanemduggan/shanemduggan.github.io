function getLocation(event) {
	var locationFound = _.find(locationData, function(l) {
		return l.location === event.locationName;
	});

	if (locationFound) {
		event.formattedAddress = locationFound.formattedAddress;
		event.lat = locationFound.lat;
		event.lng = locationFound.lng;
	}
	return event;
}

function daysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
}

function getDateFilterOptions() {
	var year = 2017;
	var currentMonth = new Date().getMonth() + 1;
	var currentDay = new Date().getDate();
	var daysInCurrentMonth = daysInMonth(currentMonth, year);
	var days = [];
	var monthsArray = [];

	monthsArray[0] = 'January';
	monthsArray[1] = 'February';
	monthsArray[2] = 'March';
	monthsArray[3] = 'April';
	monthsArray[4] = 'May';
	monthsArray[5] = 'June';
	monthsArray[6] = 'July';
	monthsArray[7] = 'August';
	monthsArray[8] = 'September';
	monthsArray[9] = 'October';
	monthsArray[10] = 'November';
	monthsArray[11] = 'December';

	var date = new Date();
	var monthName = monthsArray[date.getMonth()];

	for (var i = currentDay; i < daysInCurrentMonth + 1; i++) {
		days.push(monthName + ' ' + i);
	}

	return days;
}

function checkDate() {
	var date = new Date();
	var utcDate = new Date(date.toUTCString());
	utcDate.setHours(utcDate.getHours() - 8);
	var usDate = new Date(utcDate);
	var month = usDate.getUTCMonth() + 1;
	month = month.toString();
	if (month.length == 1)
		month = '0' + month;
	var day = usDate.getUTCDate().toString();
	var year = usDate.getUTCFullYear().toString();
	var newdate = month + day + year;
	return newdate;
}

function getMonth() {
	var date = new Date();
	var utcDate = new Date(date.toUTCString());
	utcDate.setHours(utcDate.getHours() - 8);
	var usDate = new Date(utcDate);
	return usDate.getUTCMonth() + 1;
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

// function flashTab() {
// $('.tablinks').css('background-color', 'white');
// $('.tablinks').css('opacity', '1.0');
// $('.tablinks').css('color', 'black');
// //color: black;
// setTimeout(function() {
// // background-color: black;   	color: white;   opacity: 0.8;
// $('.tablinks').css('background-color', 'black');
// $('.tablinks').css('opacity', '0.8');
// $('.tablinks').css('color', 'white');
// }, 500);
// }