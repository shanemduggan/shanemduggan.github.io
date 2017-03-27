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
				//console.log(HTML);
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

function filterMapDate(parent) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
	var locations = [];

	$('#sidePanel ul').html('');
	$('#sidePanel h3').remove();
	var dateFiltered = $(parent).find('h3').text()
	$('#sidePanel').prepend('<h3>' + dateFiltered + '</h3>');
	$("#selectType").val('0');
	var nodes = $(parent).find('li');
	var newArray = $.makeArray(nodes).slice(0, 20);

	newArray.forEach(function(item, i) {
		if ($(item).find('span.itemHeader a').length) {
			var address = $(item).find('span.itemHeader a').attr('id').replace('\\', '');
			var location = $(item).find('span.itemHeader a').text();
		}
		var name = $(item).find('span.itemHeader').attr('id');
		var date = $(item).find('span.date').text().replace(')', '').trim();

		var item = {
			'locationAddress' : address,
			'location' : location,
			'name' : name,
			'date' : date
		}

		addMarkerOnLoad(item);

		$('#sidePanel ul').append('<li>' + item.name + '</li>');

	});
}

function filterMapType(nodes, type) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
	var locations = [];
	$('#sidePanel ul').html('');
	$('#sidePanel h3').remove();
	$('#sidePanel').prepend('<h3>' + type + '</h3>');
	$("#selectDate").val('0');
	var newArray = $.makeArray(nodes).slice(0, 20);
	newArray.forEach(function(item, i) {
		if ($(item).find('span.itemHeader a').length) {
			var address = $(item).find('span.itemHeader a').attr('id').replace('\\', '');
			var location = $(item).find('span.itemHeader a').text();
		}
		var name = $(item).find('span.itemHeader').attr('id');
		var date = $(item).find('span.date').text().replace(')', '').trim();

		var item = {
			'locationAddress' : address,
			'location' : location,
			'name' : name,
			'date' : date
		}
		addMarkerOnLoad(item);
		$('#sidePanel ul').append('<li>' + item.name + '</li>');

	});
}
