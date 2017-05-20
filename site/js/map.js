function initMap() {
	var browserHeight = $('html').height();
	var mapHeight = Math.ceil(browserHeight * .90);
	$('#map_canvas').height(mapHeight);

	map = new google.maps.Map(document.getElementById('map_canvas'), {
		zoom : 11,
		center : {
			lat : 34.0416,
			lng : -118.328661
		},
		mapTypeControl : false
	});

	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	});

	google.maps.event.addListener(map, "click", function(event) {
		$('.pop').hide();
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
				__loc : events[i].locationName,
				__date : events[i].date,
				__type : events[i].type,
				__lng : events[i].lng,
				__lat : events[i].lat,
				map : map,
				animation : google.maps.Animation.DROP,
				title : events[i].name
			});

			if (events[i].name.length > 50) {
				var fullName = events[i].name; events[i].name.replace(/^(.{50}[^\s]*).*/, "$1") + "\n";
				var title = '<div class="iw-title" title="' + fullName + '"><a target="_blank" href="' + events[i].detailPage + '">' + events[i].name + '</a></div>';
			} else
				var title = '<div class="iw-title"><a target="_blank" href="' + events[i].detailPage + '">' + events[i].name + '</a></div>';

			var date = '<div class="iw-subTitle">' + events[i].date + ' @ ' + events[i].locationName + '</div>';
			events[i].type = getFilterOption(events[i].type);
			var type = '<p>' + events[i].type + '</p>';

			var fbShare = '<button class="fb-share-button" data-href="' + events[i].detailPage + '"' + 'data-layout="button_count" data-size="small" data-mobile-iframe="false"><a class="fb-xfbml-parse-ignore" target="_blank"' + 'href="https://www.facebook.com/sharer/sharer.php?u=' + events[i].detailPage + '&amp;src=sdkpreparse">Share on Facebook</a></button>';

			var lengthOfTweet = events[i].detailPage.length + events[i].name.length + 25;
			var twitterShare = '<button id="twitterButton"><a target="_blank" href="https://twitter.com/share?url=' + events[i].detailPage + '&text=Found this on HereSay - ' + events[i].name + '"</a>Share on Twitter</button>';
			var content = '<div id="iw-container">' + title + '<div class="iw-content">' + '<p></p>' + date + type + fbShare + twitterShare + '</div>' + '<div class="iw-bottom-gradient"></div>' + '</div>';

			var infowindow = new google.maps.InfoWindow({
				content : content,
				maxWidth : 350
			});

			google.maps.event.addListener(marker, 'click', function() {
				if (openCards.length > 0) {
					openCards[openCards.length - 1].close();
					openCards = [];
					infowindow.open(map, marker);
				} else if (openCards.length == 0)
					infowindow.open(map, marker);

				//toggleBounce(marker);
				marker.setAnimation(null);
				map.panTo(marker.position);
				openCards.push(infowindow);

			});

			google.maps.event.addListener(map, 'click', function() {
				infowindow.close();
			});

			marker.addListener('mouseover', function() {
				//infowindow.open(map, this);
				//marker.setAnimation(google.maps.Animation.DROP);
				//marker.setAnimation(google.maps.Animation.BOUNCE);
				toggleBounce(marker);
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

			markers[events[i].name] = marker;
		})(i);
	}

	console.log('after creating markers we have: ' + Object.keys(markers).length, 'should have around: ' + events.length);
}

function toggleBounce(marker) {
	// if (marker.getAnimation() !== null) {
	// marker.setAnimation(null);
	// } else {
	// marker.setAnimation(google.maps.Animation.BOUNCE);
	// }

	marker.setAnimation(google.maps.Animation.BOUNCE);
	var interval = 700 * (Math.floor(Math.random() * 5) + 1);

	setTimeout(function() {
		marker.setAnimation(null);
	}, interval);
	//}, 1400);
}

function toggleDrop(marker) {
	marker.setAnimation(google.maps.Animation.DROP);
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

function returnMapState() {
	var centerLoc = new window.google.maps.LatLng(34.0416, -118.328661);
	var centerMarker = new google.maps.Marker({
		position : centerLoc,
		map : map,
		animation : google.maps.Animation.DROP
	});

	map.panTo(centerMarker.position);
	map.setZoom(11);
	centerMarker.setMap(null);
}
