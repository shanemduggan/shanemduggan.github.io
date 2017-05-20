function setUpFilters() {
	createDateFilterOptions();

	$('#typeFilter select').change(function(e) {
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
			
			console.log(cachedDateEvents);
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
			console.log(cachedTypeEvents);

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
		$('#sidebar ul').append('<li><span class="name">' + e.name + '</span><span class="details">' + e.locationName + '<br><span class="eventDate">' + e.date + '</span></span></li>');
	});

	$('#sidebar li').click(function() {
		showCard(this);
	});
}