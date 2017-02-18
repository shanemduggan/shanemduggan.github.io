var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
//var html = require("html");
var $ = require("jquery");


var START_URL = "https://www.timeout.com/los-angeles/things-to-do/february-events-calendar?package_page=3863";
var SEARCH_WORD = "February";
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {
	if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
		console.log("Reached max limit of number of pages to visit.");
		return;
	}
	var nextPage = pagesToVisit.pop();
	if ( nextPage in pagesVisited) {
		// We've already visited this page, so repeat the crawl
		crawl();
	} else {
		// New page we haven't visited
		visitPage(nextPage, crawl);
	}
}

function visitPage(url, callback) {
	// Add page to our set
	pagesVisited[url] = true;
	numPagesVisited++;

	// Make the request
	console.log("Visiting page " + url);
	request(url, function(error, response, body) {
		// Check status code (200 is HTTP OK)
		console.log("Status code: " + response.statusCode);
		if (response.statusCode !== 200) {
			callback();
			return;
		}
		// Parse the document body
		var $ = cheerio.load(body);
		var isWordFound = searchForWord($, SEARCH_WORD);
		if (isWordFound) {
			console.log('Word ' + SEARCH_WORD + ' found at page ' + url);

			var text = '';
			var obj = {
				events : []
			};
			var allEventNames = [];

			//.feature-item__content
			$('.feature-item').each(function(index) {
				console.log(index + ": " + $(this).text());

				var nameText = $(this).find("h3").text().trim();
				var summaryText = $(this).find(".feature_item__annotation--truncated").text().trim();
				var locationText = $(this).find('.icon_pin').text().trim();
				locationText = locationText.replace(/(\r\n|\n|\r)/gm, "");
				locationText = locationText.replace(/\s\s+/g, ' ');
				var locationLinkText = 'https://www.timeout.com' + $(this).find(".locationLink").attr("href");
				var dateText = $(this).find(".icon_calendar").text().trim();
				if (dateText == 'Now Showing') {
					return;
				}
				if (nameText.indexOf('events calendar') > -1 ) {
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
			});

			var json = JSON.stringify(obj);
			//console.log(json);
			
		
			var uniqueEventNames = allEventNames.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
			fs.writeFile('data/february/timeoutEventNAmes.txt', uniqueEventNames, 'utf8', function(err) {
				if (err) {
					return console.log(err);
				}
				console.log("The file was saved!");
			});
			
			var eventData = [];
			for (var i = 0; i < uniqueEventNames.length; i++) {
				//console.log(uniqueEventNames[i]);
				console.log(obj.events[i].name);
				if (uniqueEventNames[i] == obj.events[i].name) {
					eventData.push(obj.events[i]);
				}
			}
			var json2 = JSON.stringify(eventData);

			fs.writeFile('data/february/timeout.json', json2, 'utf8', function(err) {
				if (err) {
					return console.log(err);
				}

				console.log("The file was saved!");
			});
		} else {
			// In this short program, our callback is just calling crawl()
			callback();
		}
	});
}


function searchForWord($, word) {
	var bodyText = $('html > body').text().toLowerCase();
	return (bodyText.indexOf(word.toLowerCase()) !== -1);
}
