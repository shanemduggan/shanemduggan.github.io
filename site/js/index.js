var map;
var markers = [];
var undefinedLocationAddress = 0;
var types = [];
var eventData = [];
var locationData = [];
var historicLocData = [];
var openCards = [];
var appType = '';
var centerMarker;

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
	var eventdir = '../data/crawldata/june/juneEvents.json';
	var locationdir = '../data/locationdata/' + monthName + 'LocationsGeo.json';
	getJson(eventdir, locationdir);
	// setUpFilters();
});

function getJson(eventdir, locationdir) {
	$.getJSON(locationdir, function(data) {
		if (data.length) {
			console.log('# of locations: ' + data.length);
			locationData = data;
		}
	});

	$.getJSON('../data/locationdata/allLocationsGeo.json', function(data) {
		if (data.length) {
			console.log('# of historic locations: ' + data.length);
			historicLocData = data;
		}
	});

	$.getJSON(eventdir, function(data) {
		var filteredData = [];

		if (data.length) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].date.indexOf('-') != -1) {
					data[i].date = data[i].date.split('-')[0];
				}

				if (parseInt(data[i].date.match(/\d+/)[0]) >= new Date().getDate())
					eventData.push(data[i]);
			}
		}

		// test sorry message
		//locationData = [];
		//eventData = [];

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || $('html').width() <= 640)
			appType = 'mobile';

		if (locationData.length && eventData.length) {
			if (appType != 'mobile')
				initMap();
			afterDataLoaded();
		} else {
			$('#wrapper').hide();
			$('#sorryMessage').show();
		}
	});

}

function afterDataLoaded() {
	var browserWidth = $('html').width();
	var browserHeight = $('html').height();

	if (appType != 'mobile') {
		setUpFilters();
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
	} else {
		$('body').addClass('mobile');
		$('#map_canvas').hide();

		var headerHeight = Math.ceil(browserHeight * .07);
		var sideBarHeight = Math.ceil(browserHeight * .93);

		$('#sidebar').height(sideBarHeight);
		$('#sidebar').width(browserWidth);
		$('#header').hide();

		var days = getDateFilterOptions();
		days.unshift('All');
		var dateFilter = '<div id="dateFilter" class="scrollmenu">';
		for (var i = 0; i < days.length; i++) {
			dateFilter += '<a id="' + days[i].split(' ')[1] + '" href="#">' + days[i] + '</a>';
		}

		dateFilter += '</div>';
		$('body').append(dateFilter);

		//var types = ['Theater', 'Art', 'Food & Drink', 'Comedy', 'Music', 'Festivals', 'Sports', 'Dance', 'Family', 'Film & TV', 'Educational', 'Outdoors', 'Museum', 'Health', 'Holidays', 'Miscellaneous'];
		var types = ['All', 'Theater', 'Art', 'Food & Drink', 'Comedy', 'Music', 'Festivals', 'Sports', 'Dance', 'Family', 'Film & TV', 'Museum', 'Miscellaneous'];

		var typeFilter = '<div id="typeFilter" class="scrollmenu">';
		for (var i = 0; i < types.length; i++) {
			typeFilter += '<a id="' + types[i] + '" href="#">' + types[i] + '</a>';
		}

		typeFilter += '</div>';
		$('body').append(typeFilter);
		$('#sidebar h3').hide();
		setUpFilters();
		$('#typeFilter #Art').trigger("click");
		$('#' + days[1].split(' ')[1]).trigger("click");
	}
}

function showCard(ele, action) {
	console.log(map.getCenter());
	var name = $(ele).text();
	if (name) {
		var marker = markers[name];
		if (marker) {
			if (action == 'hover') {
				//toggleDrop(marker);
				toggleBounce(marker);
			} else if (action == 'click') {
				google.maps.event.trigger(marker, 'click');
			}
			//} else {
		} else if (action == 'click') {
			// show card with hidden marker

			// cachedDateEvents
			var event = _.find(eventData, function(e) {
				return e.name == name;
			});

			var fbButton = '<button class="fb-share-button" data-href="' + event.detailPage + '"data-layout="button_count" data-size="small" data-mobile-iframe="false"><a class="fb-xfbml-parse-ignore" target="_blank"href="https://www.facebook.com/sharer/sharer.php?u=' + event.detailPage + '&amp;src=sdkpreparse">Share</a></button>';
			var twitterButton = '<button id="twitterButton"><a target="_blank" href="https://twitter.com/share?url=' + event.detailPage + '&text=Found this on HereSay - ' + name + '"</a>Tweet</button>';
			var content = '<div id="iw-container"><div class="iw-title"><a target="_blank" href="' + event.detailPage + '">' + name + '</a></div><div class="iw-content"><div class="iw-subTitle">' + event.date + fbButton + twitterButton + '</div><br/><p>' + event.locationName + '</p></div></div>';

			var infowindow = new google.maps.InfoWindow({
				content : content,
				maxWidth : 350
			});

			google.maps.event.addListener(map, 'click', function() {
				infowindow.close();
			});

			google.maps.event.addListener(infowindow, 'domready', function() {
				var iwOuter = $('.gm-style-iw');
				var iwBackground = iwOuter.prev();
				var iwCloseBtn = iwOuter.next();

				iwBackground.children(':nth-child(2)').css({
					'display' : 'none'
				});

				iwBackground.children(':nth-child(4)').css({
					'display' : 'none'
				});

				iwCloseBtn.css({
					'opacity' : '1',
					'right' : '58px',
					'top' : '20px',
					'border-radius' : '13px',
				});

				// If the content of infowindow not exceed the set maximum height, then the gradient is removed.
				if ($('.iw-content').height() < 140) {
					$('.iw-bottom-gradient').css({
						display : 'none'
					});
				}
			});

			if (openCards.length > 0) {
				openCards[openCards.length - 1].close();
				openCards = [];
				setTimeout(function() {
					infowindow.open(map, centerMarker);
				}, 200);
			} else if (openCards.length == 0) {
				setTimeout(function() {
					infowindow.open(map, centerMarker);
				}, 200);
			}

			map.panTo(centerMarker.position);
			openCards.push(infowindow);
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
	} else {
		console.log(event);
		var historiclocationFound = _.find(historicLocData, function(l) {
			return l.location === event.locationName;
		});
		if (historiclocationFound) {
			event.formattedAddress = historiclocationFound.formattedAddress;
			event.lat = historiclocationFound.lat;
			event.lng = historiclocationFound.lng;
		} else
			console.log(event);
	}

	return event;
}

