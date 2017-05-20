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

function getFilterOption(type) {
	if ($.inArray(type, types) == -1) {
		types.push(type);
	}

	var miscKeyWords = ['Miscellaneous', 'Other', 'Shopping', 'Community', 'Promotional', 'Activism', 'Spirituality', 'Religion', 'World', 'Competitions', 'Recreation', 'Games'];
	var musicKeyWords = ['Music', 'Alternative', 'Rock', 'DJ', 'EDM', 'House', 'Country', 'Classical', 'Jazz', 'Funk', 'Punk', 'Latin', 'Rap', 'Pop'];
	var sportsKeyWords = ['Sports', 'Basketball', 'Baseball', 'Hockey'];
	var artKeyWords = ['Gallery', 'Galleries', 'Art', 'Arts'];
	var theaterKeyWords = ['Theatre', 'Theater', 'theater'];

	if (type == "")
		return "Miscellaneous";
	var misc = _.filter(miscKeyWords, function(s) {
		return type.indexOf(s) != -1;
	});
	if (misc.length)
		return "Miscellanous";

	var theater = _.filter(theaterKeyWords, function(s) {
		return type.indexOf(s) != -1;
	});
	if (theater.length)
		return "Theater";

	var art = _.filter(artKeyWords, function(s) {
		return type.indexOf(s) != -1;
	});
	if (art.length)
		return "Art";

	var sports = _.filter(sportsKeyWords, function(s) {
		return type.indexOf(s) != -1;
	});
	if (sports.length)
		return "Sports";

	var music = _.filter(musicKeyWords, function(s) {
		return type.indexOf(s) != -1;
	});
	if (music.length)
		return "Music";

	if (type.indexOf('Museum') != -1 || type.indexOf('Museums') != -1)
		return "Museum";
	if (type.indexOf('Dance') != -1 || type.indexOf('Burlesque') != -1 || type.indexOf('Cabaret') != -1)
		return "Dance";
	if (type.indexOf('Holiday') != -1 || type.indexOf('Christmas') != -1 || type.indexOf("New Year's") != -1)
		return "Holidays";
	if (type.indexOf('Film, TV & Radio') != -1 || type.indexOf('film') != -1 || type.indexOf('Film') != -1)
		return "Film & TV";
	if (type.indexOf('Outdoors') != -1)
		return "Outdoors";
	if (type.indexOf('Family') != -1)
		return "Family";
	if (type.indexOf('MuseumsZoosAquariums') != -1)
		return "Nature";
	if (type.indexOf('Food & Drink') != -1)
		return "Food & Drink";
	if (type.indexOf('Comedy') != -1)
		return "Comedy";
	if (type.indexOf('Health') != -1)
		return "Health";
	if (type.indexOf('Festivals') != -1)
		return "Festivals";
	if (type.indexOf('Educational') != -1)
		return "Educational";
	else
		return "Miscellaneous";
}

function getMonthName(month) {
	var monthsArray = [];
	monthsArray[1] = 'january';
	monthsArray[2] = 'february';
	monthsArray[3] = 'march';
	monthsArray[4] = 'april';
	monthsArray[5] = 'may';
	monthsArray[6] = 'june';
	monthsArray[7] = 'july';
	monthsArray[8] = 'august';
	monthsArray[9] = 'september';
	monthsArray[10] = 'october';
	monthsArray[11] = 'november';
	monthsArray[12] = 'december';

	return monthsArray[month];
}