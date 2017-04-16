function initMap() {
	var losAngeles = {
		lat : 34.0416,
		lng : -118.328661
	}
	map = new google.maps.Map(document.getElementById('mapContainer'), {
		zoom : 11,
		center : losAngeles,
		/*scrollwheel : false,*/
		mapTypeControl : false
	});
}

function placeMarkers(events) {
	if (events.length)
		console.log('# of events pre-clean: ' + events.length);
		
	var events = _.uniq(events, 'name');
	if (events.length)
		console.log('# of unique events: ' + events.length);

	for (var i = 0; i < events.length; i++) {
		if (!events[i].lat)
			continue;

		(function(i) {
			var myLatlng = new google.maps.LatLng(events[i].lat, events[i].lng);
			var marker = new google.maps.Marker({
				position : myLatlng,
				__name : events[i].name,
				__link : events[i].detailPage,
				__date : events[i].date,
				__type : events[i].type,
				map : map,
				animation : google.maps.Animation.DROP
			});

			var contentString = "<html><body><div class='infoWindow'><p><h4><a target='_blank' href='" + events[i].detailPage + "'>" + events[i].name + "</a></h4>" + events[i].locationName + "<br>" + events[i].date + "</p></div></body></html>";
			var infowindow = new google.maps.InfoWindow({
				content : contentString
			});

			marker.addListener('mouseover', function() {
				infoWindowOpen++;
				infowindow.open(map, this);
			});

			marker.addListener('mouseout', function() {
				if (infoWindowOpen < 5) {
					setTimeout(function() {
						infoWindowOpen--;
						infowindow.close();
					}, 3000);
				} else {
					setTimeout(function() {
						infoWindowOpen--;
						infowindow.close();
					}, 100);
				}
			});

			google.maps.event.addListener(marker, 'click', function() {
				window.open(this.__link, '_blank');
			});

			markers[events[i].name] = marker;
		})(i);
	}

	console.log('after creating markers we have: ' + Object.keys(markers).length, 'should have around: ' + events.length);
}

function clearMarkers() {
	if (!Object.keys(markers).length)
		return;

	for (var key in markers) {
		// skip loop if the property is from prototype
		if (!markers.hasOwnProperty(key))
			continue;
		markers[key].setMap(null);
	}
	markers = [];
}

function show(id) {
	var myid = $(id).find('a').text();
	if (markers[myid]) {	
		map.panTo(markers[myid].position);
		map.setZoom(13);
		new google.maps.event.trigger(markers[myid], 'mouseover');
	}

}

function hide(id) {
	var myid = $(id).find('a').text();
	if (markers[myid])
		new google.maps.event.trigger(markers[myid], 'mouseout');
}

function returnMapState() {
	var losAngeles = {
		lat : 34.0416,
		lng : -118.328661
	}

	var centerLoc = new window.google.maps.LatLng(losAngeles.lat, losAngeles.lng);
	var centerMarker = new google.maps.Marker({
		position : centerLoc,
		map : map,
		animation : google.maps.Animation.DROP
	});

	map.panTo(centerMarker.position);
	map.setZoom(11);
	centerMarker.setMap(null);
}
