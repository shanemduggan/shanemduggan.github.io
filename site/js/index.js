var map;
var markers = [];
var undefinedLocationAddress = 0;
var types = [];
var eventData = [];
var locationData = [];
var infoWindowOpen = 0;
var openInfoWindows = [];

var currentMonth = new Date().getMonth() + 1;
var monthName = getMonthName(currentMonth);

// cached data
var cachedDateEvents = [];
var cachedTypeEvents = [];

// filtered data
var dateEvents = [];
var typeEvents = [];

// multi filtered data
var dateTypeEvents = [];
var typeDateEvents = [];

$(window).on('load', function() {
	var eventdir = '../data/crawldata/' + monthName + '/mayEvents.json';
	var locationdir = '../data/locationdata/mayLocationsGeo.json';
	getJson(eventdir, locationdir);
	setUpFilters();
});

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
		initMap();
		afterDataLoaded();
	});
}

function afterDataLoaded() {
	var browserWidth = $('html').width();
	var browserHeight = $('html').height();
	var headerHeight = Math.ceil(browserHeight * .07);
	var mapHeight = Math.ceil(browserHeight * .93);

	$('#header').height(headerHeight);
	$('#dateFilter').height(headerHeight);
	$('#dateFilter select').height(headerHeight - 2);
	$('#typeFilter').height(headerHeight);
	$('#typeFilter select').height(headerHeight - 2);
	$('#map_canvas').height(mapHeight);
	$('#sidebar').height(mapHeight);

	$("#selectDate").val('1').trigger('change');
	$("#selectType").val('2').trigger('change');

	$('.close').click(function() {
		$('.pop').hide();
		$('#popName').html('');
		$('#popDateType').html('');
		return false;
	});
}

function showCard(ele) {

	$('#popName').html('');
	$('#popDateType').html('');
	if (ele.__name) {
		var name = ele.__name;

		if (markers[name]) {
			$('.pop').show();
			$('#popName').append('<a target="_blank" href="' + markers[name].__link + '">' + name + '</a>');
			$('#popDateType').html(markers[name].__type + '<br>' + markers[name].__date);
			$('.arrow-up').show();
		}

		// hover show pop up
		// if mouse over on pop up, show
		// if mouse out, hide after .5 sec

	} else {
		var name = $(ele).find(".name").text();
		if (markers[name]) {
			$('.pop').show();
			$('#popName').append('<a target="_blank" href="' + markers[name].__link + '">' + name + '</a>');
			$('#popDateType').text(markers[name].__date + ' || ' + markers[name].__type);
		}
	}

}

function createDateFilterOptions() {
	var monthDates = getDateFilterOptions();
	for (var i = 0; i < monthDates.length; i++) {
		$('#dateFilter select').append($('<option>', {
			value : i + 1,
			text : monthDates[i]
		}));
	}
}

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

