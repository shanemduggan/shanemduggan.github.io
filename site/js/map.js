

// function initMyMap() {
// var losAngeles = {
// lat : 34.0416,
// lng : -118.328661
// }
// personalMap = new google.maps.Map(document.getElementById('personalMap'), {
// zoom : 11,
// center : losAngeles,
// mapTypeControl : false
// });
// }

// function show(id) {
// var myid = $(id).find('a').text();
// if (markers[myid]) {
// map.panTo(markers[myid].position);
// map.setZoom(13);
// new google.maps.event.trigger(markers[myid], 'mouseover');
// }
//
// }
//
// function hide(id) {
// var myid = $(id).find('a').text();
// if (markers[myid])
// new google.maps.event.trigger(markers[myid], 'mouseout');
// }

// function returnMapState() {
// var losAngeles = {
// lat : 34.0416,
// lng : -118.328661
// }
//
// var centerLoc = new window.google.maps.LatLng(losAngeles.lat, losAngeles.lng);
// var centerMarker = new google.maps.Marker({
// position : centerLoc,
// map : map,
// animation : google.maps.Animation.DROP
// });
//
// map.panTo(centerMarker.position);
// map.setZoom(11);
// centerMarker.setMap(null);
// }

/*function addToPersonalMap(event) {
 // if (!event.lat)
 // return;

 console.log($(event).text());
 if ($(event).text())
 var name = $(event).text();
 else
 return;
 // var locationFound = _.find(markers, function(m) {
 // return l.location === event.locationName;
 // });
 var oldMarker = markers[name];
 if (!oldMarker)
 return;

 var marker = new google.maps.Marker({
 position : oldMarker.position,
 __name : oldMarker.__name,
 __link : oldMarker.__detailPage,
 __date : oldMarker.__date,
 __type : oldMarker.__type,
 map : personalMap,
 animation : google.maps.Animation.DROP
 });

 var locationName = "";
 var contentString = "<html><body><div class='infoWindow'><p><h4><a target='_blank' href='" + oldMarker.__detailPage + "'>" + oldMarker.__name + "</a></h4>" + locationName + "<br>" + oldMarker.__date + "</p></div></body></html>";
 var infowindow = new google.maps.InfoWindow({
 content : contentString
 });

 marker.addListener('mouseover', function() {
 //infoWindowOpen++;
 infowindow.open(map, this);
 });

 marker.addListener('mouseout', function() {
 //if (infoWindowOpen < 5) {
 //	setTimeout(function() {
 //		infoWindowOpen--;
 infowindow.close();
 //	}, 3000);
 //} else {
 //	setTimeout(function() {
 //	infoWindowOpen--;
 //		infowindow.close();
 //	}, 100);
 //}
 });

 google.maps.event.addListener(marker, 'click', function() {
 window.open(this.__link, '_blank');
 });

 //markers[event.name] = marker;
 console.log('added ' + event + ' to personal map');
 }*/
