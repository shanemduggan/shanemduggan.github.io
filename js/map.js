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

function placeMarkerAndGeoCode(address, item) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if (!results)
			return;
		if (status == google.maps.GeocoderStatus.OK) {
			var lat = results[0].geometry.location.lat();
			var lng = results[0].geometry.location.lng();

			var myLatlng = new google.maps.LatLng(lat, lng);
			var marker = new google.maps.Marker({
				position : myLatlng,
				map : map,
				animation : google.maps.Animation.DROP
			});

			markers.push(marker);

			if (!item)
				return;
			var contentString = "<html><body><div><p><h4>" + item.name + "</h4>" + item.date + "<br>" + item.location + "</p></div></body></html>";
			var infowindow = new google.maps.InfoWindow({
				content : contentString
			});

			marker.addListener('mouseover', function() {
				infowindow.open(map, this);
			});

			marker.addListener('mouseout', function() {
				infowindow.close();
			});
			
			

			//console.log(map);
		}
	});
}

function addMarkerOnLoad(item) {
	//console.log(item.locationAddress);
	//var timer = Math.floor((Math.random() * 60000) + 1);
	var timer = Math.floor((Math.random() * 60000) + 500);
	//console.log(timer);
	setTimeout(function() {
		placeMarkerAndGeoCode(item.locationAddress, item);
	}, timer);
}

// function getCoordinates(address) {
	// var geocoder = new google.maps.Geocoder();
	// geocoder.geocode({
		// 'address' : address
	// }, function(results, status) {
		// if (status == google.maps.GeocoderStatus.OK) {
			// var lat = results[0].geometry.location.lat();
			// var lng = results[0].geometry.location.lng();
			// return lat;
		// }
	// });
// }