function setUpFilters() {
	createDateFilterOptions();

	$('#typeFilter select').change(function(e) {
		var typeIndex = $('#typeFilter select').val();
		var typeVal = $("#typeFilter select option[value='" + typeIndex + "']").text();
		var dateIndex = $('#dateFilter select').val();
		var dateVal = $("#dateFilter select option[value='" + dateIndex + "']").text();
		clearMarkers();

		// if type or date are not selected
		if (typeIndex == 0 && dateIndex == 0) {
			$('#sidePanel ul').html('');
			$('#sidePanel h3').remove();
			return;
		}

		// if type is changed, date not selected
		if (typeIndex != 0 && dateIndex == 0) {
			for (var i = 0; i < eventData.length; i++) {
				if (eventData[i].type && typeVal == getFilterOption(eventData[i].type))
					// cache type filtered events for later use
					cachedTypeEvents.push(getLocation(eventData[i]));
			}

			placeMarkers(cachedTypeEvents);
			updateSideBar(typeVal, cachedTypeEvents);

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
				placeMarkers(cachedDateEvents);
				updateSideBar(dateVal, cachedDateEvents);
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

				placeMarkers(cachedDateEvents);
				updateSideBar(dateVal, cachedDateEvents);
			}
		}
	});

	$('#dateFilter select').change(function(e) {
		var dateIndex = $('#dateFilter select').val();
		var dateVal = $("#dateFilter select option[value='" + dateIndex + "']").text();
		var typeIndex = $('#typeFilter select').val();
		var typeVal = $("#typeFilter select option[value='" + typeIndex + "']").text();
		clearMarkers();

		// if date or type are not selected
		if (dateIndex == 0 && typeIndex == 0) {
			$('#sidePanel ul').html('');
			$('#sidePanel h3').remove();
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

			placeMarkers(cachedDateEvents);
			updateSideBar(dateVal, cachedDateEvents);
		} else if (dateIndex != 0 && typeIndex != 0) {
			// filter cached type events by date
			console.log(cachedTypeEvents);

			typeDateEvents = _.filter(cachedTypeEvents, function(e) {
				return e.date == dateVal;
			});
			placeMarkers(typeDateEvents);
			updateSideBar(typeVal + ' for ' + dateVal, typeDateEvents);
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
			placeMarkers(cachedTypeEvents);
			updateSideBar(typeVal, cachedTypeEvents);
		}
	});
}

function nearMeButton() {
	var dateIndex = $('#dateFilter select').val();
	var dateVal = $("#dateFilter select option[value='" + dateIndex + "']").text();
	var typeIndex = $('#typeFilter select').val();
	var typeVal = $("#typeFilter select option[value='" + typeIndex + "']").text();

	if (dateIndex != 0 || typeIndex != 0) {
		console.log(markers);

		// Check for geolocation support
		if (navigator.geolocation) {
			// Use method getCurrentPosition to get coordinates
			navigator.geolocation.getCurrentPosition(function(position) {
				// Access them accordingly
				var userLatLng = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				var goodMarkers = markers.filter(function(marker, index, array) {
					var myLatlng = new window.google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng());
					return google.maps.geometry.spherical.computeDistanceBetween(userLatLng, myLatlng) < 5000;
				});

				var badMarkers = markers.filter(function(marker, index, array) {
					var myLatlng = new window.google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng());
					return google.maps.geometry.spherical.computeDistanceBetween(userLatLng, myLatlng) > 5000;
				});
				// 5000 is roughly 3 miles

				for (var i = 0; i < badMarkers.length; i++) {
					badMarkers[i].setMap(null);
				}

				var userMarker = new google.maps.Marker({
					position : userLatLng,
					map : map,
					animation : google.maps.Animation.DROP
				});
				
				map.panTo(userMarker.position);
				map.setZoom(13);
				userMarker.setMap(null);

				$('#sidePanel ul').html('');
				$('#sidePanel h3').remove();
				$('#sidePanel').prepend('<h3>Events near you</h3>');

				for (var i = 0; i < goodMarkers.length; i++) {
					if (goodMarkers[i].__name) {
						var name = goodMarkers[i].__name;
						if (goodMarkers[i].__link)
							var link = goodMarkers[i].__link;
						$('#sidePanel ul').append('<li><a target="_blank" href="' + link + '">' + name + '</a></li>');
					}
				}
			});
		}
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

function updateSideBar(heading, sideBarEvents) {
	$('#sidePanel ul').html('');
	$('#sidePanel h3').remove();
	$('#sidePanel').prepend('<h3>' + heading + '</h3>');
	sideBarEvents.forEach(function(e) {
		$('#sidePanel ul').append('<li><a target="_blank" href="' + e.detailPage + '">' + e.name + '</a></li>');
	});
}

function clearMarkers() {
	markers.forEach(function(marker) {
		marker.setMap(null);
	});

	markers = [];
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