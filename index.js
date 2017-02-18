$(document).ready(function() {
	var jsonFiles = ['laweekly.json', 'discover.json'];

	setUpButtons();
	sortFunctions();

	for (var i = 0; i < jsonFiles.length; i++) {
		getJson(jsonFiles[i]);
	}

});

function getJson(fileDir) {
	var showData = $('#show-data');
	var fullDir = 'data/february/' + fileDir;
	$.getJSON(fullDir, function(data) {
		var filteredData = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i].date.includes('Until') || data[i].date.includes(' - ')) {
			} else {
				filteredData.push(data[i]);
			}
		}

		var items = filteredData.map(function(item) {
			var index = item.date.indexOf('February');
			var date = item.date.slice(index, item.date.length);
			var dateSplit = item.date.split(' ');

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

			return '<span class="itemHeader" id="' + item.name + '"><b>' + item.name + '</b>' + ' (<a target="_blank" href="' + item.locationLink + '">' + item.location + '</a>; <span class="date" id="' + numDate + '">' + item.date + ') ' + '</span></span><br>' + item.summary;
		});
		//showData.empty();
		if (items.length) {
			var content = '<li>' + items.join('</li><li>') + '</li>';

			if ($('#show-data').find('ul').length == 0) {
				var list = $('<ul />').html(content).trigger("app-appened");
				;
				showData.append(list);
			} else {
				//showData.append(content);
				$('#show-data').find('ul').append(content).trigger("app-appened");
				;
			}
		}
	});

	//showData.text('Loading the JSON file.');
	$('#user-data').append('<ul id="user-data-list"></ul>');
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
		var elems = $(this).find('ul').children();
		elems.sort(function(a, b) {
			return parseInt($(a).find('.date')[0].id) > parseInt($(b).find('.date')[0].id)
		});
		$('#show-data').find('ul').append(elems);
		$('#user-data').css('height', $('#show-data').height());
	});

	setTimeout(function() {
		var eventNodes = $('#show-data').find('li');
		for (var i = 0; i < eventNodes.length; i++) {
			$(eventNodes[i]).click(function() {
				var headerData = $(this).contents('span').html();
				var split = headerData.split('</b>');
				var name = split[0].replace('<b>', '')
				var nodeCheck = $('#user-data-list').find(":contains(" + name + ")");
				if (nodeCheck.length)
					return;
				$('#user-data-list').append('<li class="user-data-node">' + headerData + '</li>').trigger("user-appened");
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

