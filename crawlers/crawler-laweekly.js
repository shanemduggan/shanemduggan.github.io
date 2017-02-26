// "http://www.laweekly.com/calendar?dateRange[]=2017-02-26";

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
var $ = require("jquery");
var moment = require('moment');

var startURL = "http://www.laweekly.com/calendar?dateRange[]=";
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
	var dynamicURL = startURL + year + '-' + currentMonth + '-' + i;
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
		var dateSplit = urlSplit[1].split('-')
		var monthNum = dateSplit[1];
		var dayNum = dateSplit[2];
		var formattedMonth = moment(monthNum, 'MM').format('MMMM');
		var monthText = formattedMonth + ' ' + dayNum;

		var $ = cheerio.load(body);
		var isWordFound = searchForWord($, searchWord);

		if (isWordFound) {
			var content = $('.results').find('.result-day').children('ul');

			for (var i = 0; i < content.length; i++) {
				//console.log(content[i]);
				var children = $(content[i]).children('li');
				$(children).each(function(index) {
					var childID = $(this)[0].attribs.class;
					console.log(childID);
					if (childID == "goldstar" || childID == "inline-ad" || childID == "yieldmo-placement")
						return;

					var nameText = $(this).find(".title").text().replace(/\s+/g, ' ').trim();
					var locationName = $(this).find('.location').children();
					locationName = $(locationName)[0].children[0].data;
					var detailPage = $(this).find(".title").children().attr("href");
					detailPage = 'http://www.laweekly.com' + detailPage;

					allEventNames.push(nameText);

					obj.events.push({
						name : nameText,
						summary : '',
						location : locationName,
						detailPage : detailPage,
						date : monthText
					});

					console.log(obj.events);
				});
			}

			console.log(obj);
			secondRequest(obj);
			// var nextNum = index + 1;
			// if (nextNum == URLlist.length) {
			// secondRequest(obj);
			// }

			// firstRequest(URLlist[nextNum], nextNum);
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
	for (var i = 0; i < 2; i++) {
		//for (var i = 0; i < obj.events.length; i++) {
		if (obj.events[i].detailPage != "" || obj.events[i].detailPage != '') {
			console.log(obj.events[i].detailPage);
			var url = obj.events[i].detailPage;
			console.log(i);
			if (url == undefined)
				return;
			makeSecondRequest(url, i, function(val, i) {
				console.log(val);
				obj.events[i].address = val.address;
				obj.events[i].type = val.type;
				obj.events[i].summary = val.summary;
				console.log(i);
				console.log(obj.events[i]);
				number++

				//if (number == obj.events.length) {
				if (number == 2) {
					console.log(i + ' is greater than ' + obj.events.length);
					var json = JSON.stringify(obj);
					var length = obj.events.length;

					fs.writeFile('data\\february\\laweekly.json', json, 'utf8', function(err) {
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

		var eventHTML = $('.content');
		if (eventHTML) {
			data.type = $('.categories').text().replace(/\s+/g, ' ').trim();
			data.summary = $('.col-desc').text().replace(/\s+/g, ' ').trim();
			data.address = $('.address').text().replace(/\s+/g, ' ').trim();
		}

		console.log(data);
		return callback(data, i);

	});
}