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

			//var contentString = "<html class='infoWindow'><body><div class='infoWindow' style='text-align: center'><p><h4><a target='_blank' href='" + events[i].detailPage + "'>" + events[i].name + "</a></h4>" + events[i].locationName + "<br>" + events[i].date + "</p></div></body></html>";
			// var infowindow = new google.maps.InfoWindow({
			// content : contentString
			// });

			var content = '<div id="iw-container">' + '<div class="iw-title">' + events[i].name + '</div>' + '<div class="iw-content">' + '<p></p>' + '<div class="iw-subTitle">Contacts</div>' + '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>' + '<br></p>' + '</div>' + '<div class="iw-bottom-gradient"></div>' + '</div>';

			// A new Info Window is created and set content
			var infowindow = new google.maps.InfoWindow({
				content : content,

				// Assign a maximum value for the width of the infowindow allows
				// greater control over the various content elements
				maxWidth : 350
			});

			// This event expects a click on a marker
			// When this event is fired the Info Window is opened.
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map, marker);
			});

			// Event that closes the Info Window with a click on the map
			google.maps.event.addListener(map, 'click', function() {
				infowindow.close();
			});

			google.maps.event.addListener(infowindow, 'domready', function() {

				// Reference to the DIV that wraps the bottom of infowindow
				var iwOuter = $('.gm-style-iw');

				/* Since this div is in a position prior to .gm-div style-iw.
				 * We use jQuery and create a iwBackground variable,
				 * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
				 */
				var iwBackground = iwOuter.prev();

				// Removes background shadow DIV
				iwBackground.children(':nth-child(2)').css({
					'display' : 'none'
				});

				// Removes white background DIV
				iwBackground.children(':nth-child(4)').css({
					'display' : 'none'
				});

				//
				// // Moves the infowindow 115px to the right.
				// iwOuter.parent().parent().css({
				// left : '115px'
				// });

				// // Moves the shadow of the arrow 76px to the left margin.
				// iwBackground.children(':nth-child(1)').attr('style', function(i, s) {
				// return s + 'left: 76px !important;'
				// });
				//
				// // Moves the arrow 76px to the left margin.
				// iwBackground.children(':nth-child(3)').attr('style', function(i, s) {
				// return s + 'left: 76px !important;'
				// });

				// Changes the desired tail shadow color.
				iwBackground.children(':nth-child(3)').find('div').children().css({
					//'box-shadow' : 'rgba(72, 181, 233, 0.6) 0px 1px 6px',
					'z-index' : '1'
				});

				// Reference to the div that groups the close button elements.
				var iwCloseBtn = iwOuter.next();

				// Apply the desired effect to the close button
				iwCloseBtn.css({
					opacity : '1',
					right : '38px',
					top : '3px',
					border : '7px solid #EEDD82',
					'border-radius' : '13px',
					//'box-shadow' : '0 0 5px #3990B9'
				});

				// If the content of infowindow not exceed the set maximum height, then the gradient is removed.
				if ($('.iw-content').height() < 140) {
					$('.iw-bottom-gradient').css({
						display : 'none'
					});
				}

				// The API automatically applies 0.7 opacity to the button after the mouseout event. 
				// This function reverses this event to the desired value.
				iwCloseBtn.mouseout(function() {
					$(this).css({
						opacity : '0.7'
					});
				});
			});

			markers[events[i].name] = marker;
		})(i);
	}

	console.log('after creating markers we have: ' + Object.keys(markers).length, 'should have around: ' + events.length);
}

// need new event. change colors?
function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}

	setTimeout(function() {
		//map.panTo(marker.position);
		marker.setAnimation(null);
	}, 1400);

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
