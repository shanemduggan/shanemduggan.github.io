function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
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