var map;

$(document).ready(function() {
	var jsonFiles = ['timeout.json', 'laweekly.json', 'discover.json'];

	setUpButtons();
	sortFunctions();
	initMap();

	for (var i = 0; i < jsonFiles.length; i++) {
		getJson(jsonFiles[i]);
	}
});

function initMap() {
	var losAngeles = {
		lat : 34.0416,
		lng : -118.328661
	}
	map = new google.maps.Map(document.getElementById('mapContainer'), {
		zoom : 11,
		center : losAngeles,
		scrollwheel : false,
		mapTypeControl : false
	});
}

function placeMarker(address, item) {
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
				map : map,
				animation : google.maps.Animation.DROP
			});

			console.log(item);
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
		}
	});
}

function addMarkerOnLoad(item) {
	console.log(item.locationAddress);
	var timer = Math.floor((Math.random() * 20000) + 1);
	console.log(timer);
	setTimeout(function() {
		placeMarker(item.locationAddress, item);
	}, timer);
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
			// var namePiece = '<span class="itemHeader" id="' +
			//item.name + '"><b>' + item.name + '</b>';
			// var datePiece = '';
			var summaryPiece = '';

			if (filteredData[i].summary != "")
				summaryPiece = '<br>' + item.summary + '<br><br>';

			if (item.locationAddress) {
				locationAddress = item.locationAddress;
				addMarkerOnLoad(item);
			} else
				locationAddress = '';

			if (item.type) {
				console.log(item.date);
				console.log(item.type);
				var type = getFilterOption(item.type);
				console.log(type);
				item.type = type;
			} else
				item.type = '';

			if (filteredData[i].location == "") {
				filteredData[i].element = '<span class="itemHeader" data-type="' + item.type + '" id="' + item.name + '"><b>' + item.name + '</b>' + ' (<span class="date" id="' + numDate + '">' + item.date + ') ' + '</span></span>' + summaryPiece;
			} else {
				filteredData[i].element = '<span class="itemHeader" data-type="' + item.type + '" id="' + item.name + '"><b>' + item.name + '</b>' + ' (<a target="_blank" id="' + locationAddress + '" href="' + item.locationLink + '">' + item.location + '</a>; <span class="date" id="' + numDate + '">' + item.date + ') ' + '</span></span>' + summaryPiece;
			}
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

function getFilterOption(type) {
	var type = type.replace('/', '').trim();
	switch (type) {
	case "Museums & Galleries":
		return "Art Gallery & Museum";
	case "Sports":
		return "Sports";
	case "Festivals":
		return "Festivals";
	case "Art & Theatre":
		return "Art & Theatre";
	case "Miscellaneous":
		return "Miscellaneous";
	case "Music":
		return "Music";
	case "Educational":
		return "Educational";
	default:
		return "Miscellaneous";
	}
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

	setTimeout(function() {
		$('#show-data').hide();
		$('#user-data').hide();
	}, 10);
}

function setUpButtons() {
	$('body').on('click', 'li.user-data-node', function() {
		$(this).remove();
	});

	$('#user-data-clear').click(function() {
		$('#user-data-list').html('');
	});

	$('#hideMap').click(function() {
		$("#wrapper").toggle();
	});

	$('#hideLists').click(function() {
		$("#show-data").toggle();
		$("#user-data").toggle();
	});

	$('#typeFilter select').change(function(e) {
		$('#show-data').show();
		var index = $('#typeFilter select').val();
		var val = $("#typeFilter select option[value='" + index + "']").text();
		console.log(val);

		var uls = $('#show-data ul');
		if (val == "Show all") {
			for (var i = 0; i < uls.length; i++) {
				$(uls[i].parentElement).parent().show();
				$('#show-data li').show();
			}
		} else if (val == "Select an event type") {
			for (var i = 0; i < uls.length; i++) {
				$(uls[i].parentElement).parent().show();
				$('#show-data li').show();
			}
			$('#show-data').hide();
		} else {
			for (var i = 0; i < uls.length; i++) {
				var lis = $(uls[i]).children();
				$(lis).hide();
				for (var p = 0; p < lis.length; p++) {
					if ($(lis[p]).find('span').attr('data-type') != "") {
						if ($(lis[p]).find('span').attr('data-type') == val) {
							$(lis[p]).show();
						}
					}
				}
			}
			var ulsArray = $.makeArray(uls);
			ulsArray.forEach(function(ele) {
				console.log(ele);
				if ($(ele).find('li:visible').length === 0) {
					$(ele.parentElement).parent().hide();
				}
			});
		}
	});

	$('#dateFilter select').change(function(e) {
		$('#show-data').show();
		var index = $('#dateFilter select').val();
		var val = $("#dateFilter select option[value='" + index + "']").text();
		var uls = $('#show-data ul');
		if (val == "Show all") {
			for (var i = 0; i < uls.length; i++) {
				$(uls[i].parentElement).parent().show();
			}
		} else if (val == "Select a date") {
			for (var i = 0; i < uls.length; i++) {
				$(uls[i].parentElement).parent().show();
				$('#show-data li').show();
			}
			$('#show-data').hide();
		} else {
			for (var i = 0; i < uls.length; i++) {
				$(uls[i].parentElement).parent().hide();
				var parent = $(uls[i].parentElement).parent();
				var text = $(parent).find('h3:contains("' + val + '")').text();
				if (text)
					$(parent).show();
				else
					$(parent).hide();

			}
		}
	});

	// var monthDates = getDateFilterOptions();
	// console.log(monthDates);
	// for (var i = 0; i < monthDates.length; i++) {
		// $('#dateFilter select').append($('<option>', {
			// value : i + 2,
			// text : monthDates[i]
		// })); 
	// }
}

function getDateFilterOptions() {
	var date = new Date();
	var monthsArray = [];

	monthsArray[0] = 'January';
	monthsArray[1] = 'February';
	monthsArray[2] = 'March';
	monthsArray[3] = 'April';
	monthsArray[4] = 'May';
	monthsArray[5] = 'June';
	monthsArray[6] = 'July';
	monthsArray[7] = 'August';
	monthsArray[8] = 'September';
	monthsArray[9] = 'October';
	monthsArray[10] = 'November';
	monthsArray[11] = 'December';
	
	var monthName = monthsArray[date.getMonth()];
	var month = date.getMonth();
	var year = 2017;
	var date = new Date(year, month, 1);
	var days = [];
	while (date.getMonth() === month) {
		var monthDay = new Date(date).getDate();
		var monthDate = monthName + ' ' + monthDay;
		days.push(monthDate);
		date.setDate(date.getDate() + 1);
	}
	return days;
}

