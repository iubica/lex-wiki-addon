var data = require("sdk/self").data;
var contextMenu = require("sdk/context-menu");
var clipboard = require("sdk/clipboard");

function lexWikiEditWindow(newspaper, url, headline, authors, date, description) {
    var utils = require('sdk/window/utils');
    var browserWindow = utils.getMostRecentBrowserWindow();
    var window = browserWindow.content; // `window` object for the current webpage
    var msg = "* " + newspaper + ": [" + url + " " + headline + "], by " + authors + " (" + date + ")";
    var r = window.confirm(msg + "\n\nCopy to clipboard?\n");
    if (r == true) {
	// OK was pressed
	clipboard.set(msg);
    }
}

var menuItemNewYorkTimes = contextMenu.Item({
	label: "NY Times: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.nytimes.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-new-york-times.js")],
	onMessage: function (a) {
	    source = a[0];
	    url = a[1];
	    headline = a[2];
	    authors = a[3];
	    date = a[4];
	    description = a[5];
	    console.log(headline + ", by " + authors + " (" + date + ")");
	    lexWikiEditWindow(source, url, headline, authors, date, description);
	}
    });
