function setUpButtons() {
	$('#typeFilter select').change(function(e) {
		$('#show-data').show();
		var index = $('#typeFilter select').val();
		var val = $("#typeFilter select option[value='" + index + "']").text();
		//console.log(val);

		var uls = $('#show-data ul');
		var eventNodes = [];
		// if (val == "Show all") {
		// for (var i = 0; i < uls.length; i++) {
		// // $(uls[i].parentElement).parent().show();
		// // $('#show-data li').show();
		// }
		// } else if (val == "Select an event type") {
		if (val == "Select an event type") {
			// for (var i = 0; i < uls.length; i++) {
			// // $(uls[i].parentElement).parent().show();
			// // $('#show-data li').show();
			// }
			// $('#show-data').hide();
		} else {
			for (var i = 0; i < uls.length; i++) {
				var lis = $(uls[i]).children();
				$(lis).hide();
				for (var p = 0; p < lis.length; p++) {
					if ($(lis[p]).find('span').attr('data-type') != "") {
						if ($(lis[p]).find('span').attr('data-type') == val) {
							//$(lis[p]).show();
							$(lis[p]).hide();
							console.log(lis[p]);
							//filterMapType(lis[p]);
							eventNodes.push(lis[p]);
						}
					}
				}
			}
			filterMapType(eventNodes, val);

			// var ulsArray = $.makeArray(uls);
			// ulsArray.forEach(function(ele) {
			// //console.log(ele);
			// if ($(ele).find('li:visible').length === 0) {
			// $(ele.parentElement).parent().hide();
			// }
			// });

		}
	});

	$('#dateFilter select').change(function(e) {
		$('#show-data').show();
		var index = $('#dateFilter select').val();
		var val = $("#dateFilter select option[value='" + index + "']").text();
		var uls = $('#show-data ul');
		if (val == "Show all") {
			for (var i = 0; i < uls.length; i++) {
				// $(uls[i].parentElement).parent().show();
				$(uls[i].parentElement).parent().hide();
			}
		} else if (val == "Select a date") {
			for (var i = 0; i < uls.length; i++) {
				//$(uls[i].parentElement).parent().show();
				//$('#show-data li').show();
			}
			$('#show-data').hide();
		} else {
			for (var i = 0; i < uls.length; i++) {
				$(uls[i].parentElement).parent().hide();
				var parent = $(uls[i].parentElement).parent();
				var text = $(parent).find('h3:contains("' + val + '")').text();
				if (text) {
					//$(parent).show();
					$(parent).hide();
					filterMapDate(parent);
				} else
					$(parent).hide();

			}
		}
	});

	var monthDates = getDateFilterOptions();
	for (var i = 0; i < monthDates.length; i++) {
		$('#dateFilter select').append($('<option>', {
			value : i + 2,
			text : monthDates[i]
		}));
	}

	// $('body').on('click', 'li.user-data-node', function() {
	// $(this).remove();
	// });
	//
	// $('#user-data-clear').click(function() {
	// $('#user-data-list').html('');
	// });

	// $('#hideMap').click(function() {
	// $("#wrapper").toggle();
	// });
	//
	// $('#hideLists').click(function() {
	// $("#show-data").toggle();
	// $("#user-data").toggle();
	// });
}