function lexWikiFormatDate(d) {
    // Argument is assumed to be a javascript Date object

    var month = new Array();
    
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "Aug";
    month[8] = "Sept";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
		
    return month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function lexWikiFormatAuthors(authorArray) {
    var authors = "";

    for (i=0; i < authorArray.length; i++) {
	if (i == 0) {
	    authors += authorArray[0];
	} else if (i == 1 && authorArray.length == 2) {
	    authors += " and " + authorArray[i];
	} else if (i == authorArray.length - 1) {
	    authors += ", and " + authorArray[i];
	} else {
	    authors += ", " + authorArray[i];
	}
    }

    return authors;
}

function lexWikiParseNewYorkTimesArticle() {
    var url="", hdl="", authors="", date="", descr="";
    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "twitter:url" ||
	    metas[i].getAttribute("name") == "twitter:url") {
	    url = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "hdl") {
	    hdl = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "author") {
	    authors = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "dat") {
	    date = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "twitter:description") {
	    descr = metas[i].getAttribute("content");
	}
    }

    self.postMessage(["New York Times", url, hdl, authors, date, descr]);    
}

function lexWikiParseWashingtonPostArticle() {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "og:title") {
	    hdl = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("itemprop") == "description") {
	    descr = metas[i].getAttribute("content");
	}
    }
    
    var spans = document.getElementsByTagName("span");
    for (i=0; i < spans.length; i++) {
	if (spans[i].getAttribute("itemprop") == "name") {
	    authorArray.push(spans[i].innerHTML.trim());
	}
	if (spans[i].getAttribute("itemprop") == "datePublished") {
	    var date_raw = spans[i].getAttribute("content");
	    
	    if (date_raw) {
		var d = new Date(date_raw);
		date = lexWikiFormatDate(d);
	    }
	}
    }
    
    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    self.postMessage(["Washington Post", url, hdl, authors, date, descr]);    
}

function lexWikiParseWallStJournalArticle() {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "og:title") {
	    hdl = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "og:description") {
	    descr = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "author") {
	    authors = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "article.published") {
	    var date_raw = metas[i].getAttribute("content");
	    
	    if (date_raw) {
		var d = new Date(date_raw);
		date = lexWikiFormatDate(d);
	    }
	}
    }
    
    if (authors != "") {
	var spans = document.getElementsByTagName("span");
	for (i=0; i < spans.length; i++) {
	    if (spans[i].getAttribute("itemprop") == "name") {
		authorArray.push(spans[i].innerHTML.trim());
	    }
	}
    
	// Get the authors
	authors = lexWikiFormatAuthors(authorArray);
    }

    self.postMessage(["Wall St Journal", url, hdl, authors, date, descr]);    
}

function lexWikiParseBostonGlobeArticle() {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "og:title") {
	    var str = metas[i].getAttribute("content");
	    var i1 = str.search(" - The Boston Globe");
	    hdl = str.substring(0, i1);
	}
	if (metas[i].getAttribute("property") == "description") {
	    descr = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "eomportal-lastUpdate") {
	    var date_raw = metas[i].getAttribute("content");
	    
	    if (date_raw) {
		var d = new Date(date_raw);
		date = lexWikiFormatDate(d);
	    }
	}
    }
    
    var spans = document.getElementsByTagName("span");
    for (i=0; i < spans.length; i++) {
	if (spans[i].getAttribute("itemprop") == "name") {
	    authorArray.push(spans[i].innerHTML.trim());
	}
    }
    
    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    self.postMessage(["Boston Globe", url, hdl, authors, date, descr]);    
}

function lexWikiParseBostonHeraldArticle() {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("name") == "parsely-page") {
	    var str = metas[i].getAttribute("content"); // A JSON object

	    var parsely = JSON.parse(str);

	    url = parsely.link;
	    hdl = parsely.title;
	    authorArray = parsely.authors;
	    
	    var d = new Date(parsely.pub_date);
	    date = lexWikiFormatDate(d);
	}
	if (metas[i].getAttribute("property") == "description") {
	    descr = metas[i].getAttribute("content");
	}
    }
    
    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    self.postMessage(["Boston Herald", url, hdl, authors, date, descr]);    
}

function lexWikiParseCommonwealthMagazineArticle() {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "og:title") {
	    var str = metas[i].getAttribute("content");
	    var i1 = str.search(" - CommonWealth Magazine");
	    hdl = str.substring(0, i1);
	}
	if (metas[i].getAttribute("property") == "og:description") {
	    descr = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "article:published_time") {
	    var date_raw = metas[i].getAttribute("content");
	    
	    if (date_raw) {
		var d = new Date(date_raw);
		date = lexWikiFormatDate(d);
	    }
	}
    }
    
    var spans = document.querySelectorAll("p.post-meta > span.authors");
    for (i=0; i < spans.length; i++) {
	var urls = spans[i].getElementsByTagName("a");
	for (j = 0; j < urls.length; j++) {
	    if (urls[j].getAttribute("rel") == "author") {
		authorArray.push(urls[j].innerHTML.trim());
	    }
	}
    }

    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    self.postMessage(["The Commonwealth", url, hdl, authors, date, descr]);    
}

function lexWikiParseReutersArticle() {
    var url="", hdl="", authors="", date="", descr="";

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "og:title") {
	    hdl = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "description") {
	    descr = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "Author") {
	    var str = metas[i].getAttribute("content");
	    authors = str.substring(3);
	}
	if (metas[i].getAttribute("name") == "REVISION_DATE") {
	    var date_raw = metas[i].getAttribute("content");
	    
	    if (date_raw) {
		var d = new Date(date_raw);
		date = lexWikiFormatDate(d);
	    }
	}
    }

    self.postMessage(["Reuters", url, hdl, authors, date, descr]);    
}


function lexWikiParseTheInterceptArticle() {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "og:title") {
	    var str = metas[i].getAttribute("content");
	    var i1 = str.search(" - The Intercept");
	    hdl = str.substring(0, i1);
	}
	if (metas[i].getAttribute("property") == "description") {
	    descr = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "article:published_time") {
	    var date_raw = metas[i].getAttribute("content");
	    
	    if (date_raw) {
		var d = new Date(date_raw);
		date = lexWikiFormatDate(d);
	    }
	}
    }
    
    var urls = document.querySelectorAll("div.ti-byline > cite > span > a");
    for (i=0; i < urls.length; i++) {
	authorArray.push(urls[i].innerHTML.trim());
    }

    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    self.postMessage(["The Intercept", url, hdl, authors, date, descr]);    
}


function lexWikiParseArsTechicaArticle() {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("name") == "parsely-page") {
	    var str = metas[i].getAttribute("content"); // A JSON object

	    JSON.parse(str, function(k, v) {
		    if (k == "title") {
			hdl = v;
		    } else if (k == "pub_date") {
			if (v) {
			    var d = new Date(v);
			    date = lexWikiFormatDate(d);
			}
		    }
		});
	}
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "description") {
	    descr = metas[i].getAttribute("content");
	}
    }
    
    var spans = document.getElementsByTagName("span");
    for (i=0; i < spans.length; i++) {
	if (spans[i].getAttribute("itemprop") == "name") {
	    authorArray.push(spans[i].innerHTML.trim());
	}
    }
    
    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    self.postMessage(["Ars Technica", url, hdl, authors, date, descr]);    
}

function lexWikiParsePoliticoArticle() {
    var url="", hdl="", authors="", date="", descr="";

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:title") {
	    hdl = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "description") {
	    descr = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "author") {
	    authors = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "date") {
	    date = metas[i].getAttribute("content");
	}
    }
    
    self.postMessage(["Politico", url, hdl, authors, date, descr]);    
}

function lexWikiParseLexingtonMinutemanArticle() {
    var url="", hdl="", authors="", date="", descr="";

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:title") {
	    hdl = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "og:description") {
	    descr = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "author") {
	    var a = metas[i].getAttribute("content");
	    
	    authors = a.replace(/\b(\w)+\@(\w)+\.(\w)+\b/g, "").trim();
	}
    }

    var links = document.getElementsByTagName("link");
    for (i=0; i < links.length; i++) {
	if (links[i].getAttribute("rel") == "canonical") {
	    url = links[i].getAttribute("href");
	}
    }

    // Read the date as the 5th component of the URL spliced by '/', typically
    // http://lexington.wickedlocal.com/article/20150604/NEWS/150607953
    var d1 = url.split("/");
    var d2 = d1[4];
    var d3 = new Date(d2.substring(0, 4), d2.substring(5, 6), d2.substring(7, 8));
    date = lexWikiFormatDate(d3);

    self.postMessage(["Lexington Minuteman", url, hdl, authors, date, descr]);    
}

function lexWikiParseCNNArticle() {
    var url="", hdl="", authors="", date="", descr="";

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:description") {
	    descr = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("name") == "author") {
	    var a = metas[i].getAttribute("content");
	    
	    authors = a.slice(0, a.lastIndexOf(",")).trim();
	}
	if (metas[i].getAttribute("property") == "og:pubdate" ||
	    metas[i].getAttribute("name") == "pubdate" ||
	    metas[i].getAttribute("name") == "lastmod" ) {
	    var date_raw = metas[i].getAttribute("content");
	    if (date_raw) {
		var d = new Date(date_raw);
		date = lexWikiFormatDate(d);
	    }	    
	}
    }

    var links = document.getElementsByTagName("link");
    for (i=0; i < links.length; i++) {
	if (links[i].getAttribute("rel") == "canonical") {
	    url = links[i].getAttribute("href");
	}
    }

    var h = document.querySelectorAll("h1.pg-headline");
    if (h.length > 0) {
	hdl = h[0].innerHTML.trim();
    }

    self.postMessage(["CNN", url, hdl, authors, date, descr]);    
}

