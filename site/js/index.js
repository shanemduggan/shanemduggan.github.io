var map;
var markers = [];
var undefinedLocationAddress = 0;
var types = [];
var eventData = [];
var locationData = [];
var infoWindowOpen = 0;

// cached data
var cachedDateEvents = [];
var cachedTypeEvents = [];

// filtered data
var dateEvents = [];
var typeEvents = [];

// multi filtered data 
var dateTypeEvents = [];
var typeDateEvents = [];

// previous value pre filter change
var prevDateFilter;

$(document).ready(function() {
	getJson('../../crawldata/april/aprilLocationsAllData.json', '../../locationdata/aprilLocationsGeo.json');
	setUpFilters();
	sortFunctions();
	initMap();
});

function afterDataLoaded() {
	$('#user-data').append('<ul id="user-data-list"></ul>');
	$("#selectDate").val('1').trigger('change');
	$("#selectType").val('2').trigger('change');
	
	var browserHeight = screen.height;
	var headerHeight = Math.ceil(browserHeight * .0338);
	var mapHeight = Math.ceil(browserHeight * .715);
	var buttonHeight = Math.ceil(browserHeight * .026);
	
	$('#menu').height(headerHeight)
	$('#mapContainer').height(mapHeight)
	$('#typeFilter').height(buttonHeight);
	$('#dateFilter').height(buttonHeight);
	$('#nearMeWrapper').height(buttonHeight);
	
}

function getJson(eventdir, locationdir) {
	$.getJSON(locationdir, function(data) {
		if (data.length) {
			console.log('# of locations: ' + data.length);
			locationData = data;
		}
	});

	$.getJSON(eventdir, function(data) {
		var filteredData = [];

		if (data.length) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].date.indexOf('-') != -1) {
					data[i].date = data[i].date.split('-')[0];
				}

				if (parseInt(data[i].date.match(/\d+/)) >= new Date().getDate())
					eventData.push(data[i]);
			}
		}
		afterDataLoaded();
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

// date parsing
// if (item.date.includes(' - ')) {
// var dateSplit = item.date.split(' - ');
// filteredData[i].dateFirst = dateSplit[0];
// } else if (item.date.includes('-')) {
// var dateSplit = item.date.split('-');
// filteredData[i].dateFirst = dateSplit[0];
// }
//
// if (item.dateFirst) {
// var index = item.dateFirst.indexOf('February');
// var date = item.dateFirst.slice(index, item.dateFirst.length);
// var dateSplit = item.dateFirst.split(' ');
// } else {
// var index = item.date.indexOf('February');
// var date = item.date.slice(index, item.date.length);
// var dateSplit = item.date.split(' ');
// }
//
// var monthNum = getMonth();
// if (dateSplit.length == 4) {
// if (dateSplit[2].length == 1) {
// var num = '0' + dateSplit[2];
// var numDate = '0' + monthNum + num + '2017';
// } else if (dateSplit[2].length == 2) {
// var numDate = '0' + monthNum + dateSplit[2] + '2017';
// }
// } else if (dateSplit.length == 2) {
// if (dateSplit[1].length == 1) {
// var num = '0' + dateSplit[1];
// var numDate = '0' + monthNum + num + '2017';
// } else if (dateSplit[1].length == 2) {
// var numDate = '0' + monthNum + dateSplit[1] + '2017';
// }
// }
//
// filteredData[i].dateFormed = numDate;