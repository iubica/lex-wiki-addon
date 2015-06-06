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

var menuItemBostonHerald = contextMenu.Item({
	label: "Boston Herald: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.bostonherald.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-boston-herald.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });

var menuItemCommonwealthMagazine = contextMenu.Item({
	label: "Commonwealth Magazine: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.commonwealthmagazine.org"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-commonwealth-magazine.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });

var menuItemReuters = contextMenu.Item({
	label: "Reuters: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.reuters.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-reuters.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });

var menuItemTheIntercept = contextMenu.Item({
	label: "The Intercept: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.firstlook.org"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-the-intercept.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });

var menuItemArsTechnica = contextMenu.Item({
	label: "Ars Technica: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.arstechnica.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-ars-technica.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });

var menuItemPolitico = contextMenu.Item({
	label: "Politico: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.politico.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-politico.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });

var menuItemLexingtonMinuteman = contextMenu.Item({
	label: "Lexington Minuteman: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.lexington.wickedlocal.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-lexington-minuteman.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });

var menuItemCNN = contextMenu.Item({
	label: "CNN: Send to Lex-Wiki.org",
	context: contextMenu.URLContext("*.cnn.com"),
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-cnn.js")],
	onMessage: lexWikiMenuOnMessageFunction
    });
