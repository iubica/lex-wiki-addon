var data = require("sdk/self").data;
var contextMenu = require("sdk/context-menu");
var clipboard = require("sdk/clipboard");

var menuItem1 = contextMenu.Item({
	label: "Send to Lex-Wiki.org",
	contentScript: 'self.on("click", function () {' +
	'  var text = window.getSelection().toString();' +
	'  self.postMessage(text);' +
	'});',
	onMessage: function (selectionText) {
	    console.log(selectionText);
	}
    });

var menuItem2 = contextMenu.Item({
	label: "Send2 to Lex-Wiki.org",
	context: contextMenu.URLContext("*.nytimes.com"),
	contentScriptFile: data.url("menu-content-script.js"),
	onMessage: function (a) {
	    url = a[0];
	    headline = a[1];
	    authors = a[2];
	    date = a[3];
	    description = a[4];
	    console.log(headline + ", by " + authors + " (" + date + ")");
	    editWindow("New York Times", url, headline, authors, date, description);
	}
    });

function editWindow(newspaper, url, headline, authors, date, description) {
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

var menuItemNYT = contextMenu.Item({
	label: "Send NYT article to Lex-Wiki.org",
	context: contextMenu.URLContext("*.nytimes.com"),
	contentScript: 'self.on("click", function () {' +
	'  var url="", hdl="", authors="", date="", descr="";' +
	'  var metas = document.getElementsByTagName("meta");' +
	'  for (i=0; i<metas.length; i++) {' +
	'    if (metas[i].getAttribute("property") == "twitter:url") {' +
	'      url = metas[i].getAttribute("content");' +
	'    } ' +
	'    if (metas[i].getAttribute("name") == "hdl") {' +
	'      hdl = metas[i].getAttribute("content");' +
	'    } ' +
	'    if (metas[i].getAttribute("name") == "author") {' +
	'      authors = metas[i].getAttribute("content");' +
	'    } ' +
	'    if (metas[i].getAttribute("name") == "dat") {' +
	'      date = metas[i].getAttribute("content");' +
	'    } ' +
	'    if (metas[i].getAttribute("property") == "twitter:description") {' +
	'      descr = metas[i].getAttribute("content");' +
	'    } ' +
	'  } ' +
	'  self.postMessage([url, hdl, authors, date, descr]);' +
	'});',
	onMessage: function (a) {
	    url = a[0];
	    headline = a[1];
	    authors = a[2];
	    date = a[3];
	    description = a[4];
	    console.log(headline + ", by " + authors + " (" + date + ")");
	    editWindow("New York Times", url, headline, authors, date, description);
	}
});
