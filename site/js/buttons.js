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

			updateSideBar(dateVal, cachedDateEvents);
			placeMarkers(cachedDateEvents);

			// for (var i = 0; i < cachedDateEvents.length; i++) {
			// if (cachedDateEvents[i].date != dateVal)
			// console.log(cachedDateEvents[i]);
			// }

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

function nearMeButton() {
	var dateIndex = $('#dateFilter select').val();
	var dateVal = $("#dateFilter select option[value='" + dateIndex + "']").text();
	var typeIndex = $('#typeFilter select').val();
	var typeVal = $("#typeFilter select option[value='" + typeIndex + "']").text();
	var goodMarkers = [];

	if (dateIndex != 0 || typeIndex != 0) {
		console.log(markers);

		// Check for geolocation support
		if (navigator.geolocation) {
			// Use method getCurrentPosition to get coordinates
			navigator.geolocation.getCurrentPosition(function(position) {
				$('#sidePanel ul').html('');
				$('#sidePanel h3').remove();
				$('#sidePanel').prepend('<h3>Events near you</h3>');
				var userLatLng = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				for (var key in markers) {
					if (!markers.hasOwnProperty(key))
						continue;
					var myLatlng = new window.google.maps.LatLng(markers[key].getPosition().lat(), markers[key].getPosition().lng());
					if (google.maps.geometry.spherical.computeDistanceBetween(userLatLng, myLatlng) <= 5000) {
						var name = markers[key].__name;
						if (markers[key].__link)
							var link = markers[key].__link;
						$('#sidePanel ul').append('<li><a target="_blank" href="' + link + '">' + name + '</a></li>');
					} else
						markers[key].setMap(null);
				}
				markers = [];
				var userMarker = new google.maps.Marker({
					position : userLatLng,
					map : map,
					animation : google.maps.Animation.DROP
				});

				map.panTo(userMarker.position);
				map.setZoom(13);
				userMarker.setMap(null);
			});
		}
	}
}


function updateSideBar(heading, sideBarEvents) {
	$('#sidePanel ul').html('');
	$('#sidePanel h3').remove();
	$('#sidePanel').prepend('<h3>' + heading + '</h3>');
	sideBarEvents.forEach(function(e) {
		var liFound = $("#sidePanel ul li:contains('" + e.name + "')");
		if (liFound.length)
			return;
		$('#sidePanel ul').append('<li><a target="_blank" href="' + e.detailPage + '">' + e.name + '</a></li>');
	});

	$('#sidePanel li').mouseover(function() {
		show(this);
	});

	$('#sidePanel li').mouseout(function() {
		hide(this);
	});
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
