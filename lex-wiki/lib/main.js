var data = require("sdk/self").data;
var contextMenu = require("sdk/context-menu");
var clipboard = require("sdk/clipboard");
var httpRequest = require("sdk/request").Request;

// Global lex-wiki.org credential variables
var lexWikiLoginSuccess = false;
var lexWikiMenuItems = [];

// URLs supported
var lexWikiURLContext = ["*.nytimes.com",
			 "*.washingtonpost.com",
			 "*.wsj.com",
			 "*.bostonglobe.com",
			 "*.bostonherald.com",
			 "*.commonwealthmagazine.org",
			 "*.reuters.com",
			 "*.firstlook.org",
			 "*.arstechnica.com",
			 "*.politico.com",
			 "*.lexington.wickedlocal.com",
			 "*.cnn.com"
			 ];

// Invoked by menuItemLexWikiLogin
function lexWikiMenuItemLoginPredicate(context) {
    if (lexWikiLoginSuccess) {
	return false;
    } else {
	return true;
    }
}

// Invoked by menuItemLexWikiLogout
function lexWikiMenuItemLogoutPredicate(context) {
    if (lexWikiLoginSuccess) {
	return true;
    } else {
	return false;
    }
}

function lexWikiPost(msg, date, lexWikiNewsPage) {
    function lexWikiPageEditDone(response) {
	console.log("Page edit done response: " + response.text.substr(0,1000));    
	console.log("Page edit done response finished");    
    }
    
    function lexWikiModifyContent(page_contents) {
	var idx;
	var idx_section_start, idx_section_end;
	var idx_link_start, idx_link_end;
	var date_obj = new Date(date);

	// Is the link already posted?
	if (page_contents.indexOf(msg) >= 0) {
	    console.log("Link already included in page");
	    return "";
	}

	console.log("Link not already included in page");

	// Look for section starting with == News
	idx = page_contents.search(/^== *News/g);
	if (idx < 0) {
	    idx = page_contents.search(/^== *Commentary/g);
	}
	if (idx < 0) {
	    console.log("No News or Commentary section");
	    return "";
	}
	
	console.log("Found matching News section");

	// Skip past newline
	idx_section_start = page_contents.substring(idx).search(/\n/);
	if (idx_section_start < 0) {
	    console.log("Can't find newline, invalidly formatted page");
	    return "";
	}

	// Chomp the newline
	idx_section_start++;

	// Find the start of next '==' section; leave the result as '-1'
	// if no match is found
	idx_section_end = page_contents.substring(idx_section_start).search(/^==/g);
	
	// Keep parsing until we find an older date
	idx_link_start = idx_section_start;
	
	while (true) {
	    idx_link_end = page_contents.substring(idx_link_start).search(/^\*/g);
	    if (idx_link_end < 0) {
		// Reached the end of the list of entries; attach link
		// right after idx_link_start.
		break;
	    }

	    // Get the end of the line
	    idx_link_end = page_contents.substring(idx_link_start).search(/\n/g);
	    if (idx_link_end < 0) {
		// Unexpectedly, did not find a newline. Insert right after
		// the idx_link_start.
		break;
	    }
	    
	    // Get the line
	    var line = page_contents.substring(idx_link_start, idx_link_start + idx_link_end);
	    
	    // Get what's inside parentheses
	    var line_date_begin_idx = line.search(/\(([^\)]+)\) *$/g); 
	    var line_date_end_idx = line.search(/\) *$/g); 
	    if (line_date_begin_idx < 0 || line_date_end_idx < 0) {
		break;
	    }
	    
	    // Get the line date
	    var line_date = line.substring(line_date_begin_idx + 1, line_date_end_idx);

	    console.log("Found line date " + line_date);
	    
	    // Is the date newer?
	    var line_date_obj = new Date(line_date);
	    
	    if (date_obj.getTime() >= line_date_obj.getTime()) {
		// Yes we have a newer date - break out
		console.log("New link date is newer");
		break;
	    }	    

	    console.log("New link date is older");

	    // Update the index
	    idx_link_start += idx_link_end + 1;
	}

	var new_page_contents = page_contents.substring(0, idx_link_start);
	new_page_contents += msg + '\n';
	new_page_contents += page_contents.substring(idx_link_start);
	
	console.log("New page contents: " + new_page_contents);

	return "";
    }

    function lexWikiPageInfo(response) {
	var p = require('sdk/simple-prefs');  
	var page_id, edit_token, last_edit_tstamp, page_contents;
	
	console.log("Page info response (json): " + response.text);    
	
	for (var page in response.json.query.pages) {
	    console.log("Page id: " + page);
	    console.log("Page response edit token: " + response.json.query.pages[page].edittoken);
	    console.log("Page last edit timestamp: " + response.json.query.pages[page].revisions[0].timestamp);
	    console.log("Page contents: " + response.json.query.pages[page].revisions[0]["*"]);
	    
	    page_id = page;
	    edit_token = response.json.query.pages[page].edittoken;
	    last_edit_tstamp = response.json.query.pages[page].revisions[0].timestamp;
	    page_contents = response.json.query.pages[page].revisions[0]["*"];
	}
	
	var modified_page_contents = lexWikiModifyContent(page_contents);
	if (modified_page_contents) {
	    var queryUrl = p.prefs['mediaWikiSite'] + "w/api.php?action=edit&pageid=" + page_id + "&contentformat=text/x-wiki&contentmodel=wikitext&basetimestamp=" + last_edit_tstamp + "&token=" + encodeURIComponent(edit_token) + "&summary=Add-on%20edit&prependtext=" + encodeURIComponent(msg) + "%0A";
	    
	    var h = httpRequest({
		    url: queryUrl,
		    onComplete: lexWikiPageEditDone
		});
	    
	    h.post();
	    console.log("Post to " + queryUrl);
	} else {
	    console.log("No post needed");
	}
    }
    
    function lexWikiRequestPageInfo() {
	var p = require('sdk/simple-prefs');    
	var queryUrl = p.prefs['mediaWikiSite'] + "/w/api.php?action=query&prop=info|revisions&intoken=edit&rvprop=content|timestamp&titles=" + lexWikiNewsPage + "&format=json";
	
	var h = httpRequest({
		url: queryUrl,
		onComplete: lexWikiPageInfo
	    });
	
	h.post();
    }
    
    lexWikiRequestPageInfo();
}

function lexWikiEditWindow(newspaper, url, headline, 
			   authors, date, description,
			   lexWikiNewsPage) {
    var utils = require('sdk/window/utils');
    var browserWindow = utils.getMostRecentBrowserWindow();
    var window = browserWindow.content; // `window` object for the current webpage
    var msg = "* " + newspaper + ": [" + url + " " + headline + "], by " + authors + " (" + date + ")";
    
    if (!lexWikiNewsPage) {
	var r = window.confirm(msg + "\n\nCopy to clipboard?\n");
	if (r == true) {
	    // OK was pressed
	    clipboard.set(msg);
	}
    } else {
	var r = window.confirm(msg + "\n\nSend to " + lexWikiNewsPage + "?\n");
	if (r == true) {
	    // OK was pressed
	    lexWikiPost(msg, date, lexWikiNewsPage);
	}
    }
}

// Lex-wiki.org main parent menu, populated in 
// lexWikiMenuLoginOnMessageFunction(), therefore has to be declared
// ahead of the definition of that function
var menuItemLexWikiParent = contextMenu.Menu({
	label: "Send to Lex-Wiki.org",
	contentScriptFile: [data.url("article-parser.js"), data.url("menu-generic.js")],
	onMessage: lexWikiMenuOnMessageFunction,
	items: []
    });

//
// MenuOnMessage APIs
//

// For the lex-wiki.org login menu
function lexWikiMenuLoginOnMessageFunction(a) {
    var loginToken;

    console.log("lexWikiMenuLoginOnMessageFunction() called");

    function lexWikiGetNewsPages(response) {
	var p = require('sdk/simple-prefs');

	console.log("Category News response (json): " + response.text);

	// For each page in the 'News' category, create a menu button
	for (var i = 0; i < response.json.query.categorymembers.length; i++) {
	    console.log("Page id: " + response.json.query.categorymembers[i].pageid);
	    console.log("Page title: " + response.json.query.categorymembers[i].title);
	    
	    // Create the menu item for this Mediawiki page
	    var menuItem = contextMenu.Item({ 
		    label: response.json.query.categorymembers[i].title, 
		    data: response.json.query.categorymembers[i].title,
		    context: contextMenu.URLContext(lexWikiURLContext)
		});

	    // Save in the global lexWikiMenuItems array, so we can remove
	    // this menu item later when we log out 
	    lexWikiMenuItems.push(menuItem);

	    // Add the menu item to the parent menu
	    menuItemLexWikiParent.addItem(menuItem);
	}
    }

    function lexWikiLogin3(response) {
	var p = require('sdk/simple-prefs');

	var queryUrl = p.prefs['mediaWikiSite'] + "/w/api.php?action=query&list=categorymembers&cmtitle=Category:News&format=json";
	
	console.log("Login response 2 (json): " + response.text);
	console.log("Login response 2 result: " + response.json.login.result);	

	if (response.json.login.result == "Success") {
	    console.log("Login success");
	    lexWikiLoginSuccess = true;

	    var h = httpRequest({
		    url: queryUrl,
		    onComplete: lexWikiGetNewsPages
		});
	    
	    h.post();
	}
    }
    
    function lexWikiLogin2(response) {
	var p = require('sdk/simple-prefs');
	var user = p.prefs['mediaWikiUser'];
	var pw = p.prefs['mediaWikiPassword'];
	var token = response.json.login.token;
	var loginUrl = p.prefs['mediaWikiSite'] + "/w/api.php?action=login&lgname=" + user + "&lgpassword=" + pw + "&lgtoken=" + token + "&format=json";
	
	console.log("Login response 1 (json): " + response.text);
	console.log("Login response 2 result: " + response.json.login.result);
	console.log("Login response 1 token: " + response.json.login.token);
	
	var h = httpRequest({
		url: loginUrl,
		onComplete: lexWikiLogin3
	    });
	
	h.post();
    }
    
    function lexWikiLogin() {
	// Log into MediaWiki
	var p = require('sdk/simple-prefs');
	var user = p.prefs['mediaWikiUser'];
	var pw = p.prefs['mediaWikiPassword'];
	var loginUrl = p.prefs['mediaWikiSite'] + "/w/api.php?action=login&lgname=" + user + "&lgpassword=" + pw + "&format=json";
	
	var h = httpRequest({
		url: loginUrl,
		onComplete: lexWikiLogin2
	    });
	
	h.post();    
    }

    lexWikiLogin();    
}

// For the lex-wiki.org logout menu
function lexWikiMenuLogoutOnMessageFunction(a) {
    console.log("lexWikiMenuLogoutOnMessageFunction() called");

    function lexWikiLogout2(response) {
	console.log("Logout response (json): " + response.text);

	// Remove all menu items from the parent menu
	for (var i = 0; i < lexWikiMenuItems.length; i++) {
	    menuItemLexWikiParent.removeItem(lexWikiMenuItems[i]);
	    delete lexWikiMenuItems[i];
	}
	
	lexWikiMenuItems = [];

	// We're logged out
	lexWikiLoginSuccess = false;
    }

    function lexWikiLogout() {
	// Log into MediaWiki
	var p = require('sdk/simple-prefs');
	var logoutUrl =  p.prefs['mediaWikiSite'] + "/w/api.php?action=logout&format=json";
	
	var h = httpRequest({
		url: logoutUrl,
		onComplete: lexWikiLogout2
	    });
	
	h.post();    
    }

    lexWikiLogout();
}

// For URL parser menus
function lexWikiMenuOnMessageFunction(a) {
    var source = a[0];
    var url = a[1];
    var headline = a[2];
    var authors = a[3];
    var date = a[4];
    var description = a[5];
    var lexWikiNewsPage = a[6];

    console.log(headline + ", by " + authors + " (" + date + ") for " + 
		lexWikiNewsPage);
    lexWikiEditWindow(source, url, headline, authors, date, description,
		      lexWikiNewsPage);
}

//
// Menu items
//

var menuItemLexWikiSendToClipboard = contextMenu.Item({
	label: "Send to clipboard",
	data: "",
	context: contextMenu.URLContext(lexWikiURLContext)
    });

// Add the Clipboard menu to 
menuItemLexWikiParent.addItem(menuItemLexWikiSendToClipboard);

// Lex-wiki.org login menu - used to load all other menu elements
var menuItemLexWikiLogin = contextMenu.Item({
	label: "Lex-Wiki.org login",
	context: contextMenu.PredicateContext(lexWikiMenuItemLoginPredicate),
	contentScript: 'self.on("click", function () {' +
	'  self.postMessage("");' +
	'});',
	onMessage: lexWikiMenuLoginOnMessageFunction
    });

// Lex-wiki.org logout menu - used to clear all other menu elements
var menuItemLexWikiLogout = contextMenu.Item({
	label: "Lex-Wiki.org logout",
	context: contextMenu.PredicateContext(lexWikiMenuItemLogoutPredicate),
	contentScript: 'self.on("click", function () {' +
	'  self.postMessage("");' +
	'});',
	onMessage: lexWikiMenuLogoutOnMessageFunction
    });

