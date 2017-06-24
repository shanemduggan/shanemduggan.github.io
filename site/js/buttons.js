function setUpMobileFilters() {
	cachedTypeEvents = [];
	dateTypeEvents = [];
	$('#typeFilter a').click(function() {
		$('#typeFilter a.activeItem').removeClass('activeItem');
		console.log(this);
		var type = $(this).text();
		$(this).addClass('activeItem');

		if ($('#dateFilter a.activeItem').length == 0) {
			var title = type;
			var events = _.filter(eventData, function(e) {
				e.type = getFilterOption(e.type);
				return e.type == type;
			});
		} else {
			if (type == 'All') {
				var date = $('#dateFilter a.activeItem').text();
				var title = date;
				var events = _.filter(eventData, function(e) {
					return e.date == date;
				});
			} else if ($('#dateFilter a.activeItem').text() == 'All') {
				var type = $('#typeFilter a.activeItem').text();
				var title = type;
				var events = _.filter(eventData, function(e) {
					return e.type == type;
				});
			} else {
				var date = $('#dateFilter a.activeItem').text();
				var title = type + ' for ' + date;
				var events = _.filter(eventData, function(e) {
					e.type = getFilterOption(e.type);
					return e.type == type && e.date == date;
				});
			}
		}

		if ($('#typeFilter a.activeItem').text() == 'All' && $('#dateFilter a.activeItem').text() == 'All') {
			var title = 'Try selecting a date or event';
		}

		console.log(events);
		updateMobileSideBar(title, events);
	});

	$('#dateFilter a').click(function() {
		$('#dateFilter a.activeItem').removeClass('activeItem');
		console.log(this);
		var date = $(this).text();
		$(this).addClass('activeItem');

		if ($('#typeFilter a.activeItem').length == 0) {
			var title = date;
			var events = _.filter(eventData, function(e) {
				return e.date == date;
			});
		} else {
			if (date == 'All') {
				var type = $('#typeFilter a.activeItem').text();
				var title = type;
				var events = _.filter(eventData, function(e) {
					return e.type == type;
				});
			} else if ($('#typeFilter a.activeItem').text() == 'All') {
				var date = $('#dateFilter a.activeItem').text();
				var title = date;
				var events = _.filter(eventData, function(e) {
					return e.date == date;
				});
			} else {
				var type = $('#typeFilter a.activeItem').text();
				var title = type + ' for ' + date;
				var events = _.filter(eventData, function(e) {
					e.type = getFilterOption(e.type);
					return e.type == type && e.date == date;
				});
			}

		}

		if ($('#typeFilter a.activeItem').text() == 'All' && $('#dateFilter a.activeItem').text() == 'All') {
			var title = 'Try selecting a date or event';
		}

		console.log(events);
		updateMobileSideBar(title, events);
	});
}

function setUpFilters() {
	if (appType == 'mobile') {
		setUpMobileFilters();
		return;
	}

	createDateFilterOptions();

	$('#typeFilter select').change(function(e) {
		openCards.forEach(function(card) {
			card.close();
		});

		cachedTypeEvents = [];
		dateTypeEvents = [];
		var typeIndex = $('#typeFilter select').val();
		var typeVal = $("#typeFilter select option[value='" + typeIndex + "']").text();
		var dateIndex = $('#dateFilter select').val();
		var dateVal = $("#dateFilter select option[value='" + dateIndex + "']").text();
		clearMarkers();
		returnMapState();

		// if type or date are not selected
		if (typeIndex == 0 && dateIndex == 0) {
			$('#sidebar ul').html('');
			$('#sidebar h3').remove();
			clearMarkers();
			return;
		}

		// if type is changed, date not selected
		if (typeIndex != 0 && dateIndex == 0) {
			for (var i = 0; i < eventData.length; i++) {
				if (eventData[i].type && typeVal == getFilterOption(eventData[i].type))
					// cache type filtered events for later use
					cachedTypeEvents.push(getLocation(eventData[i]));
			}
			updateSideBar(typeVal, cachedTypeEvents);
			placeMarkers(cachedTypeEvents);
		} else if (typeIndex != 0 && dateIndex != 0) {

			// if type is changed, date is selected
			// filter cached date events by type

			//console.log(cachedDateEvents);
			for (var i = 0; i < cachedDateEvents.length; i++) {
				if (cachedDateEvents[i].type && typeVal == getFilterOption(cachedDateEvents[i].type))
					dateTypeEvents.push(cachedDateEvents[i]);
			}

			placeMarkers(dateTypeEvents);
			updateSideBar(typeVal + ' for ' + dateVal, dateTypeEvents);
		} else if (typeIndex == 0 && dateIndex != 0) {
			if (cachedDateEvents.length) {
				updateSideBar(dateVal, cachedDateEvents);
				placeMarkers(cachedDateEvents);
			} else {
				dateEvents = _.filter(eventData, function(e) {
					return e.date == dateVal;
				});

				if (dateEvents.length && locationData.length) {
					for (var i = 0; i < dateEvents.length; i++) {
						// cache date filtered events for later use
						cachedDateEvents.push(getLocation(dateEvents[i]));
					}
				}
				updateSideBar(dateVal, cachedDateEvents);
				placeMarkers(cachedDateEvents);
			}
		}
	});

	$('#dateFilter select').change(function(e) {
		openCards.forEach(function(card) {
			card.close();
		});

		cachedDateEvents = [];
		typeDateEvents = [];
		var dateIndex = $('#dateFilter select').val();
		var dateVal = $("#dateFilter select option[value='" + dateIndex + "']").text();
		var typeIndex = $('#typeFilter select').val();
		var typeVal = $("#typeFilter select option[value='" + typeIndex + "']").text();
		clearMarkers();
		returnMapState();

		// if date or type are not selected
		if (dateIndex == 0 && typeIndex == 0) {
			$('#sidebar ul').html('');
			$('#sidebar h3').remove();
			clearMarkers();
			return;
		}

		// if date is changed, type not selected
		if (dateIndex != 0 && typeIndex == 0) {
			dateEvents = _.filter(eventData, function(e) {
				return e.date == dateVal;
			});

			if (dateEvents.length && locationData.length) {
				for (var i = 0; i < dateEvents.length; i++) {
					// cache date filtered events for later use
					cachedDateEvents.push(getLocation(dateEvents[i]));
				}
			}

			updateSideBar(dateVal, cachedDateEvents);
			placeMarkers(cachedDateEvents);
		} else if (dateIndex != 0 && typeIndex != 0) {
			// filter cached type events by date
			//console.log(cachedTypeEvents);

			typeDateEvents = _.filter(cachedTypeEvents, function(e) {
				return e.date == dateVal;
			});
			updateSideBar(typeVal + ' for ' + dateVal, typeDateEvents);
			placeMarkers(typeDateEvents);
		} else if (dateIndex == 0 && typeIndex != 0) {
			// if cachedTypeEvents is empty
			if (cachedTypeEvents.length) {
				placeMarkers(cachedTypeEvents);
				updateSideBar(typeVal, cachedTypeEvents);
			} else {
				for (var i = 0; i < eventData.length; i++) {
					if (eventData[i].type && typeVal == getFilterOption(eventData[i].type))
						// cache type filtered events for later use
						cachedTypeEvents.push(getLocation(eventData[i]));
				}
			}
			updateSideBar(typeVal, cachedTypeEvents);
			placeMarkers(cachedTypeEvents);
		}
	});
}

function updateSideBar(heading, sideBarEvents) {
	$('#sidebar ul').html('');
	$('#sidebar h3').remove();
	$('#sidebar').prepend('<h3>' + heading + '</h3>');
	sideBarEvents.forEach(function(e) {
		var liFound = $("#sidebar ul li:contains('" + e.name + "')");
		if (liFound.length)
			return;
		//$('#sidebar ul').append('<li><span class="name">' + e.name + '</span><span class="details">' + e.locationName + '<br><span class="eventDate">' + e.date + '</span></span></li>');
		if (appType == 'mobile')
			$('#sidebar ul').append('<li><a target="_blank" href="' + e.detailPage + '"><span class="name">' + e.name + '</span></a></li>');
		else
			$('#sidebar ul').append('<li><span class="name">' + e.name + '</span></li>');
	});

	if (appType == 'mobile')
		return;

	$('#sidebar li').click(function() {
		showCard(this, 'click');
	});

	$('#sidebar li').hover(function() {
		showCard(this, 'hover');
	});

}

function updateMobileSideBar(heading, sideBarEvents) {
	$('#sidebar ul').html('');
	$('#sidebar h3').remove();
	$('#sidebar').prepend('<h3>' + heading + '</h3>');
	$('#sidebar').animate({ scrollTop: 0 }, 125);

	sideBarEvents.forEach(function(e) {
		var liFound = $("#sidebar ul li:contains('" + e.name + "')");
		if (liFound.length)
			return;
		$('#sidebar ul').append('<li><a target="_blank" href="' + e.detailPage + '"><span class="name">' + e.name + '</span><br/><span class="eventDate">' + e.date + '</span><br/><span class="details">' + e.locationName + '<br/></span></a></li>');
		//$('#sidebar ul').append('<li><span class="name">' + e.name + '</span><br/><span class="eventDate">' + e.date + '</span><br/><span class="details">' + e.locationName + '<br/></span></li>');
		//$('#sidebar ul').append('<li><a target="_blank" href="' + e.detailPage + '"><span class="name">' + e.name + '</span></a></li>');
	});

}