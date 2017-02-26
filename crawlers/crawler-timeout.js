// https://www.timeout.com/los-angeles/en_US/paginate?id=1309&zone_id=1101479&page_number=3

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
var $ = require("jquery");

var startURL = "https://www.timeout.com/los-angeles/things-to-do/february-events-calendar?package_page=3863";
var searchWord = "February";
//var url = new URL(startURL);
var allEventNames = [];
var obj = {
	events : []
};

firstRequest(secondRequest);

function firstRequest(callback) {
	request(startURL, function(error, response, body) {
		console.log("Status code: " + response);
		if (response.statusCode !== 200)
			return;
		var $ = cheerio.load(body);
		var isWordFound = searchForWord($, searchWord);
		if (isWordFound) {
			$('.feature-item').each(function(index) {
				var nameText = $(this).find("h3").text().trim();
				var summaryText = $(this).find(".feature_item__annotation--truncated").text().trim();
				var locationText = $(this).find('.icon_pin').text().trim();
				locationText = locationText.replace(/(\r\n|\n|\r)/gm, "");
				locationText = locationText.replace(/\s\s+/g, ' ');

				var locationLinkText = $(this).find(".locationLink").attr("href");
				if (locationLinkText == undefined)
					locationLinkText = '';
				else
					locationLinkText = 'https://www.timeout.com' + $(this).find(".locationLink").attr("href");

				var dateText = $(this).find(".icon_calendar").text().trim();
				if (dateText == 'Now Showing') {
					return;
				}
				if (nameText.indexOf('events calendar') > -1) {
					return;
				}
				allEventNames.push(nameText);

				obj.events.push({
					name : nameText,
					summary : summaryText,
					location : locationText,
					locationLink : locationLinkText,
					date : dateText
				});

				//console.log(obj.events);
			});
			//console.log(obj.events.length);

			//var json = JSON.stringify(obj);
			//console.log(json);

			callback(obj);
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
		if (obj.events[i].locationLink != "") {
			console.log(obj.events[i].locationLink);
			var url = obj.events[i].locationLink;
			makeSecondRequest(url, i, function(val, i) {
				console.log(val);
				obj.events[i].locationAddress = val;
				console.log(i);
				console.log(obj.events[i]);
				number++

				if (number == obj.events.length) {
					console.log(i + ' is greater than ' + obj.events.length);
					var json = JSON.stringify(obj);
					var length = obj.events.length;

					fs.writeFile('data\\february\\timeout.json', json, 'utf8', function(err) {
						console.log("File saved with " + length + ' entries');
					});
				}
			});
		}
	}

}

function makeSecondRequest(url, i, callback) {
	request(url, function(error, response, body) {
		console.log("Status code: " + response.statusCode);
		if (response.statusCode !== 200)
			return;
		var $ = cheerio.load(body);
		if ($('.tabs__wrapper').find(':contains(Details)').length > 1) {
			var addressData = $('.listing_details').find('tr:contains(Address)').children('td').text();
			if (addressData != undefined) {
				addressData = addressData.replace(/\s\s+/g, ' ');
				//console.log(addressData);
				//return addressData;
				return callback(addressData, i);
			}
		};
	});
}

// var SEARCH_WORD = "February";
// var url = new URL(START_URL);
// var baseUrl = url.protocol + "//" + url.hostname;
// var pagesToVisit =
// pagesToVisit.push(START_URL);
//
//
// visitPage(nextPage, secondRequest());
//
// function visitPage(url, callback) {
// // Add page to our set
// pagesVisited[url] = true;
// numPagesVisited++;
//
// // Make the request
// console.log("Visiting page " + url);
// request(url, function(error, response, body) {
// // Check status code (200 is HTTP OK)
// console.log("Status code: " + response.statusCode);
// if (response.statusCode !== 200) {
// callback();
// return;
// }
// // Parse the document body
// var $ = cheerio.load(body);
// var isWordFound = searchForWord($, SEARCH_WORD);
// if (isWordFound) {
// console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
//
// var text = '';
// var obj = {
// events : []
// };
// var allEventNames = [];
//
// //.feature-item__content
// $('.feature-item').each(function(index) {
// //console.log(index + ": " + $(this).text());
//
// var nameText = $(this).find("h3").text().trim();
// var summaryText = $(this).find(".feature_item__annotation--truncated").text().trim();
// var locationText = $(this).find('.icon_pin').text().trim();
// locationText = locationText.replace(/(\r\n|\n|\r)/gm, "");
// locationText = locationText.replace(/\s\s+/g, ' ');
//
// var locationLinkText = $(this).find(".locationLink").attr("href");
// if (locationLinkText == undefined)
// locationLinkText = '';
// else
// locationLinkText = 'https://www.timeout.com' + $(this).find(".locationLink").attr("href");
//
// var dateText = $(this).find(".icon_calendar").text().trim();
// if (dateText == 'Now Showing') {
// return;
// }
// if (nameText.indexOf('events calendar') > -1 ) {
// return;
// }
// allEventNames.push(nameText);
//
// obj.events.push({
// name : nameText,
// summary : summaryText,
// location : locationText,
// locationLink : locationLinkText,
// date : dateText
// });
// });
//
// var json = JSON.stringify(obj);
// //console.log(json);
//
//
// var uniqueEventNames = allEventNames.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
// fs.writeFile('data\\february\\timeoutEventNames.txt', uniqueEventNames, 'utf8', function(err) {
// if (err) {
// return console.log(err);
// }
// console.log("The file was saved!");
// });
//
// var eventData = [];
// for (var i = 0; i < uniqueEventNames.length; i++) {
// //console.log(uniqueEventNames[i]);
// console.log(obj.events[i].name);
// if (uniqueEventNames[i] == obj.events[i].name) {
// eventData.push(obj.events[i]);
// }
// }
// var json2 = JSON.stringify(eventData);
//
// fs.writeFile('data\\february\\timeout.json', json2, 'utf8', function(err) {
// if (err) {
// return console.log(err);
// }
//
// console.log("The file was saved!");
// });
// } else {
// // In this short program, our callback is just calling crawl()
// }
// });
// callback
// }
//
// function secondRequest() {
// console.log('secondRequest');
// fs.readFile('data\\february\\timeout.json', function(err, data) {
// if (err) throw err;
// console.log(data);
// });
//
// }
//
//
// function searchForWord($, word) {
// var bodyText = $('html > body').text().toLowerCase();
// return (bodyText.indexOf(word.toLowerCase()) !== -1);
// }
