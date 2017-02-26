// "http://www.discoverlosangeles.com/what-to-do/events?when[value][date]=02/25/2017";

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
var $ = require("jquery");
var moment = require('moment');

var startURL = "http://www.discoverlosangeles.com/what-to-do/events?when[value][date]=";
var searchWord = "February";
var allEventNames = [];
var obj = {
	events : []
};
var URLlist = [];

function daysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
}

var year = 2017;
var currentMonth = new Date().getMonth() + 1;
var currentDay = new Date().getDate();
var daysInCurrentMonth = daysInMonth(currentMonth, year);

for (var i = currentDay; i < daysInCurrentMonth + 1; i++) {
	if (currentMonth.toString().length == 1)
		currentMonth = '0' + currentMonth;
	var dynamicURL = startURL + currentMonth + '/' + i + '/' + year;
	URLlist.push(dynamicURL);
}

firstRequest(URLlist[0], 0);

function firstRequest(url, index) {
	if (url == undefined)
		return;
	request(url, function(error, response, body) {
		console.log("Status code: " + response);
		if (response.statusCode !== 200)
			return;
		console.log(url);
		var urlSplit = url.split('=');
		var dateSplit = urlSplit[1].split('/')
		var monthNum = dateSplit[0];
		var dayNum = dateSplit[1];
		var formattedMonth = moment(monthNum, 'MM').format('MMMM');
		var monthText = formattedMonth + ' ' + dayNum;

		var $ = cheerio.load(body);
		var isWordFound = searchForWord($, searchWord);
		var dayElement;
		var element = $('.field-content');
		for (var i = 0; i < element.length; i++) {
			var headerText = $(element[i]).text();
			if (headerText.indexOf(monthText)) {
				dayElement = element[i];
				break;
			}
		}

		console.log(dayElement);

		if (dayElement) {
			var content = $(dayElement).parent().next().children()[0];
			var children = $(content).children('.views-row');

			$(children).each(function(index) {
				var nameText = $(this).find("h2").text().trim();
				var summaryText = '';
				var locationText = $(this).find('.field-name-field-event-venue').children().children().text().trim();
				var eventDetailLink = $(this).find("h2").children().attr("href");
				eventDetailLink = 'http://www.discoverlosangeles.com' + eventDetailLink;

				allEventNames.push(nameText);

				obj.events.push({
					name : nameText,
					summary : summaryText,
					location : locationText,
					eventDetail : eventDetailLink
				});

				//console.log(obj.events);
			});

			console.log(obj);
			var nextNum = index + 1;
			if (nextNum == URLlist.length) {
				secondRequest(obj);
			}
			firstRequest(URLlist[nextNum], nextNum);
		}
	});
}

function searchForWord($, word) {
	var bodyText = $('html > body').text().toLowerCase();
	return (bodyText.indexOf(word.toLowerCase()) !== -1);
}

function secondRequest(obj) {
	console.log('secondRequest');
	var that = this;
	var number = 0;
	for (var i = 0; i < obj.events.length; i++) {
		if (obj.events[i].eventDetail != "" || obj.events[i].eventDetail != '') {
			console.log(obj.events[i].eventDetail);
			var url = obj.events[i].eventDetail;
			console.log(i);
			if (url == undefined)
				return;
			makeSecondRequest(url, i, function(val, i) {
				console.log(val);
				obj.events[i].locationAddress = val.address;
				obj.events[i].date = val.date;
				obj.events[i].type = val.type;
				obj.events[i].summary = val.summary;
				console.log(i);
				console.log(obj.events[i]);
				number++

				if (number == obj.events.length) {
					console.log(i + ' is greater than ' + obj.events.length);
					var json = JSON.stringify(obj);
					var length = obj.events.length;

					fs.writeFile('data\\february\\discover.json', json, 'utf8', function(err) {
						console.log("File saved with " + length + ' entries');
					});
				}
			});
		}
	}
}

function makeSecondRequest(url, i, callback) {
	console.log('crawling event details for ' + url)
	request(url, function(error, response, body) {
		if (!response)
			return;
		console.log("Status code: " + response.statusCode);
		if (response.statusCode !== 200)
			return;
		var $ = cheerio.load(body);
		var data = [];
		var eventHTML = $('#event_tabs');
		if (eventHTML) {
			summaryNodes =  $('#event_tabs').find('.detail-page-description .field-item').children()[0];
			var addressSrc = $('#event_tabs').find('.poi-map').children('img');
			if (addressSrc != undefined && !addressSrc._root) {
				addressSrc = $(addressSrc)[0].attribs.src
				var p = addressSrc.split('png')[1].slice(addressSrc.split('png')[1].indexOf("%20"), addressSrc.split('png')[1].length)
				var urlSplit = p.split('%20');
			}

			data.date = $(eventHTML).find('.detail-page-date-time .date').text();
			data.type = $(eventHTML).find('.detail-page-breadcrumb')[0].childNodes[2].data;
			data.summary = $(summaryNodes).text();
			if (urlSplit != undefined)
				data.address = urlSplit.join(' ');
		}

		console.log(data);
		return callback(data, i);
	});
}