var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
var $ = require("jquery");

var startURL = "https://www.timeout.com/los-angeles/things-to-do/february-events-calendar?package_page=3863";
var searchWord = "February";
var url = new URL(startURL);

visitPage(url);

function visitPage(url) {
	// Make the request
	console.log("Visiting page " + url);
	request(url, function(error, response, body) {
		// Check status code (200 is HTTP OK)
		console.log("Status code: " + response.statusCode);
		if (response.statusCode !== 200) {
			return;
		}
		var $ = cheerio.load(body);
		var isWordFound = searchForWord($, searchWord);
		if (isWordFound) {
			console.log('Word ' + searchWord + ' found at page ' + url);

			$('.class').each(function(index) {
				obj.push({
					name : nameText
				});
			});

			var json = JSON.stringify(obj);
			fs.writeFile('path/to/jsonfile', json, 'utf8', function(err) {
				if (err) {
					return console.log(err);
				}

				console.log("The file was saved!");
			});
		}
	});
}

function searchForWord($, word) {
	var bodyText = $('html > body').text().toLowerCase();
	return (bodyText.indexOf(word.toLowerCase()) !== -1);
}
