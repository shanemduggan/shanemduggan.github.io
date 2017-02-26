var map;

$(document).ready(function() {
	var jsonFiles = ['timeout.json', 'laweekly.json', 'discover.json'];

	setUpButtons();
	sortFunctions();

	for (var i = 0; i < jsonFiles.length; i++) {
		getJson(jsonFiles[i]);
	}

	initMap();

});

function initMap() {
	var losAngeles = {
		lat : 34.0416,
		lng : -118.328661
	}
	map = new google.maps.Map(document.getElementById('mapContainer'), {
		zoom : 11,
		center : losAngeles,
		scrollwheel : false
	});
}

function placeMarker(address) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var lat = results[0].geometry.location.lat();
			var lng = results[0].geometry.location.lng();

			var myLatlng = new google.maps.LatLng(lat, lng);
			var marker = new google.maps.Marker({
				position : myLatlng,
				map : map
			});

			var contentString = "<html><body><div><p><h4>" + address + "</h4></p></div></body></html>";
			var infowindow = new google.maps.InfoWindow({
				content : contentString
			});

			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
		}
	});

}

function getJson(fileDir) {
	var showData = $('#show-data');
	var fullDir = 'data/february/' + fileDir;
	$.getJSON(fullDir, function(data) {
		var filteredData = [];

		if (data.length) {
			for (var i = 0; i < data.length; i++) {
				filteredData.push(data[i]);
			}
		} else {
			for (var i = 0; i < data.events.length; i++) {
				if (!data.events[i].date.includes('Until'))
					filteredData.push(data.events[i]);
			}
		}

		for (var i = 0; i < filteredData.length; i++) {
			var item = filteredData[i];
			var nameSplit = filteredData[i].name.split(' ');
			if (nameSplit[0] == nameSplit[0].toUpperCase()) {
				var newName = toTitleCase(filteredData[i].name);
				filteredData[i].name = newName;
			}

			if (item.date.includes(' - ')) {
				var dateSplit = item.date.split(' - ');
				filteredData[i].dateFirst = dateSplit[0];
			} else if (item.date.includes('-')) {
				var dateSplit = item.date.split('-');
				filteredData[i].dateFirst = dateSplit[0];
			}

			if (item.dateFirst) {
				var index = item.dateFirst.indexOf('February');
				var date = item.dateFirst.slice(index, item.dateFirst.length);
				var dateSplit = item.dateFirst.split(' ');
			} else {
				var index = item.date.indexOf('February');
				var date = item.date.slice(index, item.date.length);
				var dateSplit = item.date.split(' ');
			}

			if (dateSplit.length == 4) {
				if (dateSplit[2].length == 1) {
					var num = '0' + dateSplit[2];
					var numDate = '02' + num + '2017';
				} else if (dateSplit[2].length == 2) {
					var numDate = '02' + dateSplit[2] + '2017';
				}
			} else if (dateSplit.length == 2) {
				if (dateSplit[1].length == 1) {
					var num = '0' + dateSplit[1];
					var numDate = '02' + num + '2017';
				} else if (dateSplit[1].length == 2) {
					var numDate = '02' + dateSplit[1] + '2017';
				}
			}

			filteredData[i].dateFormed = numDate;

			// var locationPiece = '';
			// var namePiece = '<span class="itemHeader" id="' + item.name + '"><b>' + item.name + '</b>';
			// var datePiece = '';
			var summaryPiece = '';

			if (filteredData[i].summary != "")
				summaryPiece = '<br>' + item.summary + '<br><br>';

			if (item.locationAddress)
				locationAddress = item.locationAddress;
			else
				locationAddress = '';

			if (filteredData[i].location == "")
				filteredData[i].element = '<span class="itemHeader" id="' + item.name + '"><b>' + item.name + '</b>' + ' (<span class="date" id="' + numDate + '">' + item.date + ') ' + '</span></span>' + summaryPiece;
			else
				filteredData[i].element = '<span class="itemHeader" id="' + item.name + '"><b>' + item.name + '</b>' + ' (<a target="_blank" id="' + locationAddress + '" href="' + item.locationLink + '">' + item.location + '</a>; <span class="date" id="' + numDate + '">' + item.date + ') ' + '</span></span>' + summaryPiece;
		}

		if (filteredData.length) {
			for (var i = 0; i < filteredData.length; i++) {
				var potentialParent = $('#show-data').find("ul#" + filteredData[i].dateFormed);
				if (potentialParent.length) {
					potentialParent.append('<li>' + filteredData[i].element + '</li>')
				} else {
					if (filteredData[i].dateFirst)
						$('#show-data').append('<div class="show-data-box" id="' + filteredData[i].dateFormed + '"><div><h3>' + filteredData[i].dateFirst + '</h3><ul id="' + filteredData[i].dateFormed + '"><li>' + filteredData[i].element + '</li></ul></div></div>').trigger("app-appened");
					else
						$('#show-data').append('<div class="show-data-box" id="' + filteredData[i].dateFormed + '"><div><h3>' + filteredData[i].date + '</h3><ul id="' + filteredData[i].dateFormed + '"><li>' + filteredData[i].element + '</li></ul></div></div>').trigger("app-appened");
				}
			}
		}
	});

	$('#user-data').append('<ul id="user-data-list"></ul>');
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function sortFunctions() {
	$("body").on("user-appened", "div", function(event) {
		var elems = $(this).find('ul').children();
		elems.sort(function(a, b) {
			return parseInt($(a).find('.date')[0].id) > parseInt($(b).find('.date')[0].id)
		});
		$('#user-data-list').append(elems);
	});

	$("body").on("app-appened", "div", function(event) {
		$('#user-data').css('height', $('#show-data').height() + 30);
		var elems = $('#show-data').find('.show-data-box');
		if (elems.length > 1) {
			elems.sort(function(a, b) {
				return parseInt($(a)[0].id) > parseInt($(b)[0].id)
			});

			$('#show-data').html('');
			for (var i = 0; i < elems.length; i++) {
				$('#show-data').append(elems[i]);
			}
		}

		setTimeout(function() {
			$('#mapContainer').css('margin-top', $('#show-data').height() + 100)
		}, 500);

	});

	setTimeout(function() {
		var eventNodes = $('#show-data').find('li');
		for (var i = 0; i < eventNodes.length; i++) {
			$(eventNodes[i]).click(function() {

				if ($('#user-data-welcome').css('display') == 'block')
					$('#user-data-welcome').hide();

				var headerData = $(this).contents('span').html();
				var split = headerData.split('</b>');
				var name = split[0].replace('<b>', '')
				var nodeCheck = $('#user-data-list').find(":contains(" + name + ")");
				if (nodeCheck.length)
					return;
				$('#user-data-list').append('<li class="user-data-node">' + headerData + '</li>').trigger("user-appened");

				var HTML = $(this).html();
				console.log(HTML);
				var location = $(HTML).find('a')[0].id;
				if (location != "")
					placeMarker(location);
			});
		}
	}, 1000);
}

function setUpButtons() {
	$('body').on('click', 'li.user-data-node', function() {
		$(this).remove();
	});

	$('#show-data-close').click(function() {
		$('#show-data').animate({
			width : 'toggle'
		}).trigger("show-data-toggled");

		if ($('#show-data-close').text() == 'Close')
			$('#show-data-close').text('Open');
		else if ($('#show-data-close').text() == 'Open')
			$('#show-data-close').text('Close');
	});

	$("body").on("show-data-toggled", "div", function(event) {
		setTimeout(function() {
			if ($('#show-data').css('display') == 'none') {
				$('#user-data').css('width', '100%');
			} else {
				var bodyWidth = $('body').width();
				var userWidth = $('#user-data').width();
				if (userWidth / bodyWidth >= .20)
					$('#user-data').css('width', '38%');
				else
					$('#user-data').css('width', '19%');
			}
		}, 500);
	});

	$('#user-data-close').click(function() {
		$('#user-data').animate({
			width : 'toggle'
		}).trigger("user-data-toggled");

		if ($('#user-data-close').text() == 'Close')
			$('#user-data-close').text('Open');
		else if ($('#user-data-close').text() == 'Open')
			$('#user-data-close').text('Close');
	});

	$("body").on("user-data-toggled", "div", function(event) {
		setTimeout(function() {
			if ($('#user-data').css('display') == 'none') {
				$('#show-data').css('width', '100%');
				$('#user-data-clear').hide()
				$('#user-data-expand').hide()
				$('#user-data-collapse').hide()

			} else {
				$('#show-data').css('width', '80%');
				$('#user-data-clear').show()
				$('#user-data-expand').show()
				$('#user-data-collapse').show()
			}
		}, 500);
	});

	$('#user-data-expand').click(function() {
		if ($('#user-data-expand').text() == 'Expand') {
			$('#user-data').css('width', '38%');
			$('#show-data').css('width', '60%');
			$('#user-data-expand').text('Collapse');
			$('#user-data').css('height', $('#show-data').height());
		} else if ($('#user-data-expand').text() == 'Collapse') {
			$('#user-data').css('width', '19%');
			$('#show-data').css('width', '80%');
			$('#user-data-expand').text('Expand');
			$('#show-data').css('height', $('#user-data').height());
		}

	});

	$('#user-data-clear').click(function() {
		$('#user-data-list').html('');
	});
}

