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

function lexWikiMenuOnMessageFunction(a) {
    var source = a[0];
    var url = a[1];
    var headline = a[2];
    var authors = a[3];
    var date = a[4];
    var description = a[5];

    console.log(headline + ", by " + authors + " (" + date + ")");
    lexWikiEditWindow(source, url, headline, authors, date, description);
}

var menuItemNewYorkTimes = contextMenu.Item({
	label: "NY Times: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.nytimes.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-new-york-times.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });

var menuItemWashingtonPost = contextMenu.Item({
	label: "WashPost: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.washingtonpost.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-washington-post.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });

var menuItemWallStJournal = contextMenu.Item({
	label: "WSJ: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.wsj.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-wall-st-journal.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });

var menuItemBostonGlobe = contextMenu.Item({
	label: "Boston Globe: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.bostonglobe.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-boston-globe.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });
