var lexWikiMonths = ["Jan",
		     "Feb",
		     "Mar",
		     "Apr",
		     "May",
		     "June",
		     "July",
		     "Aug",
		     "Sept",
		     "Oct",
		     "Nov",
		     "Dec"];
		

function lexWikiFormatDate(date) {
    // Argument is assumed to be a javascript Date object

    if (typeof date == 'object') {
	// A 'Date' object
	return lexWikiMonths[date.getMonth()] + " " + 
	    date.getDate() + ", " + date.getFullYear();
    } else if (typeof date == 'string') {
	var v = Date.parse(date);

	if (!isNaN(v)) {
	    var d = new Date(date);
	    return lexWikiFormatDate(d);
	}
	
	// Dates of format YYYY-MM-DD, followed by non-standard stuff.
	// This is the case of Washington Post.
	var dateArray = date.match(/\d{4}-\d{2}-\d{2}/);
	if (dateArray && dateArray[0]) {
	    var d = new Date(dateArray[0]);
	    return lexWikiFormatDate(d);
	}

	return "";
    }
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

function lexWikiParseNewYorkTimesArticle(lexWikiNewsPage) {
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
	if (metas[i].getAttribute("property") == "twitter:description") {
	    descr = metas[i].getAttribute("content");
	}
    }

    var time = document.querySelectorAll("time.dateline");
    if (time.length) {
	var date_raw = time[0].getAttribute("datetime");
	date = lexWikiFormatDate(date_raw);
    }

    self.postMessage(["New York Times", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseWashingtonPostArticle(lexWikiNewsPage) {
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
	    date = lexWikiFormatDate(date_raw);
	}
    }
    
    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    self.postMessage(["Washington Post", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseWallStJournalArticle(lexWikiNewsPage) {
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
	    date = lexWikiFormatDate(date_raw);
	}
    }
    
    if (authors == "") {
	var spans = document.getElementsByTagName("span");
	for (i=0; i < spans.length; i++) {
	    if (spans[i].getAttribute("itemprop") == "name") {
		authorArray.push(spans[i].innerHTML.trim());
	    }
	}
    
	// Get the authors
	authors = lexWikiFormatAuthors(authorArray);
    }

    if (date == "") {
	// Blog posts use date in the format below
	var h = document.querySelectorAll("small.post-time");
	if (h.length > 0) {
	    console.log("h.length is " + h.length);
	    var date_raw = h[0].innerHTML;

	    console.log("h[0].innerHTML is " + h[0].innerHTML);
	    
	    // Format of date_raw is " 4:40 pm  ET<br/>Jun 9, 2015  "
	    // But in fact for some reason the break element is converted
	    // to <br> when parsed as innerHTML string, so we will
	    // skip forward past <br>
	    var i = date_raw.search("<br>");
	    if (i > 0) {
		date = date_raw.substring(i+4).trim();
	    }
	}
    }

    self.postMessage(["Wall St Journal", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseBostonGlobeArticle(lexWikiNewsPage) {
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
    }
    
    var spans = document.getElementsByTagName("span");
    for (i=0; i < spans.length; i++) {
	if (spans[i].getAttribute("itemprop") == "name") {
	    authorArray.push(spans[i].innerHTML.trim());
	}
    }
    
    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    // Some articles use a different format for authors
    if (!authors) {
	var b = document.querySelectorAll("b.author");
	if (b.length >= 1) {
	    var idx = b[0].innerHTML.search("By ");
	    if (idx >= 0) {
		authors = b[0].innerHTML.substring(idx + 3);
	    }
	}
    }

    // Get the date
    var elts = document.querySelectorAll("time[itemprop='datePublished']");
    if (elts.length > 0) {
	var date_raw = elts[0].getAttribute("datetime");
	date = lexWikiFormatDate(date_raw);
    }    

    self.postMessage(["Boston Globe", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseBostonHeraldArticle(lexWikiNewsPage) {
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
	    date = lexWikiFormatDate(parsely.pub_date);
	}
	if (metas[i].getAttribute("property") == "description") {
	    descr = metas[i].getAttribute("content");
	}
    }
    
    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    self.postMessage(["Boston Herald", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseCommonwealthMagazineArticle(lexWikiNewsPage) {
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
	    date = lexWikiFormatDate(date_raw);
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

    self.postMessage(["The Commonwealth", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseReutersArticle(lexWikiNewsPage) {
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
	    date = lexWikiFormatDate(date_raw);
	}
    }

    self.postMessage(["Reuters", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseTheInterceptArticle(lexWikiNewsPage) {
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
	    if (i1 >= 0) {
		hdl = str.substring(0, i1);
	    } else {
		hdl = str;
	    }
	}
	if (metas[i].getAttribute("property") == "description") {
	    descr = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "article:published_time") {
	    var date_raw = metas[i].getAttribute("content");
	    date = lexWikiFormatDate(date_raw);
	}
    }
    
    var urls = document.querySelectorAll("div.ti-byline > cite > span > a");
    for (i=0; i < urls.length; i++) {
	authorArray.push(urls[i].innerHTML.trim());
    }

    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    self.postMessage(["The Intercept", url, hdl, authors, date, descr,
		      lexWikiNewsPage]);    
}

function lexWikiParseArsTechicaArticle(lexWikiNewsPage) {
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
			date = lexWikiFormatDate(v);
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

    self.postMessage(["Ars Technica", url, hdl, authors, date, descr,
		      lexWikiNewsPage]);    
}

function lexWikiParsePoliticoArticle(lexWikiNewsPage) {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

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
    }

    authorArray = authors.split(" and ");

    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);
    
    var elts = document.querySelectorAll("p.timestamp > time");
    if (elts.length > 0) {
	var date_raw = elts[0].getAttribute("datetime");
	date = lexWikiFormatDate(date_raw);
    }

    self.postMessage(["Politico", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseWickedLocalArticle(lexWikiNewsPage, newspaperName) {
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

    self.postMessage([newspaperName, url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseLexingtonMinutemanArticle(lexWikiNewsPage) {
    lexWikiParseWickedLocalArticle(lexWikiNewsPage, "Lexington Minuteman");
}

function lexWikiParseWorcesterTelegramArticle(lexWikiNewsPage) {
    lexWikiParseWickedLocalArticle(lexWikiNewsPage, "Worcester Telegram");    
}

function lexWikiParseCNNArticle(lexWikiNewsPage) {
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
	    date = lexWikiFormatDate(date_raw);
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

    self.postMessage(["CNN", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseTheAtlanticArticle(lexWikiNewsPage) {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:title") {
	    hdl = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "og:description") {
	    descr = metas[i].getAttribute("content");
	}
    }

    var links = document.getElementsByTagName("link");
    for (i=0; i < links.length; i++) {
	if (links[i].getAttribute("rel") == "canonical") {
	    url = links[i].getAttribute("href");
	}
    }

    var byline = document.querySelectorAll("div.article-cover-extra li.byline > a");
    for (i=0; i < byline.length; i++) {
	authorArray.push(byline[i].innerHTML);
    }

    // Get the authors
    authors = lexWikiFormatAuthors(authorArray);

    var t = document.querySelectorAll("time");
    if (t.length > 0) {
	var date_raw = t[0].getAttribute("datetime");
	date = lexWikiFormatDate(date_raw);
    }

    self.postMessage(["The Atlantic", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseUSNewsAndWorldReportArticle(lexWikiNewsPage) {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	} else if (metas[i].getAttribute("name") == "og:description") {
	    descr = metas[i].getAttribute("content");
	} else if (metas[i].getAttribute("property") == "og:title") {
	    var str = metas[i].getAttribute("content");
	    var i1 = str.search(" - US News");
	    hdl = str.substring(0, i1);
	} else if (metas[i].getAttribute("property") == 
		   "article:published_time") {
	    var date_raw = metas[i].getAttribute("content");
	    date = lexWikiFormatDate(date_raw);
	} 
    }
    
    var links = document.getElementsByTagName("link");
    for (i=0; i < links.length; i++) {
	if (links[i].getAttribute("rel") == "canonical") {
	    url = links[i].getAttribute("href");
	}
    }
    
    var byline = document.querySelectorAll("meta.swiftype[name='author']");
    if (byline.length > 0) {
	authors = byline[0].getAttribute("content");
    }
    
    self.postMessage(["US News & World Report", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseUSATodayArticle(lexWikiNewsPage) {
    var url="", hdl="", authors="", date="", descr="";
    var authorArray = [];

    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	} else if (metas[i].getAttribute("name") == "og:description") {
	    descr = metas[i].getAttribute("content");
	} else if (metas[i].getAttribute("property") == "og:title") {
	    var hdl = metas[i].getAttribute("content");
	} else if (metas[i].getAttribute("itemprop") == 
		   "datePublished") {
	    var date_raw = metas[i].getAttribute("content");
	    date = lexWikiFormatDate(date_raw);
	} 
    }
    
    var s1 = document.querySelectorAll("span.asset-metabar-author[itemprop='name']");
    if (s1.length > 0) {
	var s2 = s1[0].innerHTML.trim().replace(/<\/?[^>]+(>|$)/g, ""); 
	authors = s2.replace(", USA TODAY", "");
    }
    
    self.postMessage(["USA Today", url, hdl, authors, date, descr, 
		      lexWikiNewsPage]);    
}

function lexWikiParseGenericArticle(node, data) {
    var lexWikiNewsPage = data;
    var urlHost = window.location.host;

    console.log("You clicked " + lexWikiNewsPage);
    console.log("At " + window.location.href);
    console.log("Host " + window.location.host);
    
    if (urlHost.match(/nytimes\.com$/)) {
	lexWikiParseNewYorkTimesArticle(lexWikiNewsPage);
    } else if (urlHost.match(/washingtonpost\.com$/)) {
	lexWikiParseWashingtonPostArticle(lexWikiNewsPage);
    } else if (urlHost.match(/wsj\.com$/)) {
	lexWikiParseWallStJournalArticle(lexWikiNewsPage);
    } else if (urlHost.match(/bostonglobe\.com$/)) {
	lexWikiParseBostonGlobeArticle(lexWikiNewsPage);
    } else if (urlHost.match(/bostonherald\.com$/)) {
	lexWikiParseBostonHeraldArticle(lexWikiNewsPage);
    } else if (urlHost.match(/commonwealthmagazine\.org$/)) {
	lexWikiParseCommonwealthMagazineArticle(lexWikiNewsPage);
    } else if (urlHost.match(/reuters\.com$/)) {
	lexWikiParseReutersArticle(lexWikiNewsPage);
    } else if (urlHost.match(/firstlook\.org$/)) {
	lexWikiParseTheInterceptArticle(lexWikiNewsPage);
    } else if (urlHost.match(/arstechnica\.com$/)) {
	lexWikiParseArsTechicaArticle(lexWikiNewsPage);
    } else if (urlHost.match(/politico\.com$/)) {
	lexWikiParsePoliticoArticle(lexWikiNewsPage);
    } else if (urlHost.match(/lexington\.wickedlocal\.com$/)) {
	lexWikiParseLexingtonMinutemanArticle(lexWikiNewsPage);
    } else if (urlHost.match(/telegram\.com$/)) {
	lexWikiParseWorcesterTelegramArticle(lexWikiNewsPage);
    } else if (urlHost.match(/cnn\.com$/)) {
	lexWikiParseCNNArticle(lexWikiNewsPage);
    } else if (urlHost.match(/theatlantic\.com$/)) {
	lexWikiParseTheAtlanticArticle(lexWikiNewsPage);
    } else if (urlHost.match(/usnews\.com$/)) {
	lexWikiParseUSNewsAndWorldReportArticle(lexWikiNewsPage);
    } else if (urlHost.match(/usatoday\.com$/)) {
	lexWikiParseUSATodayArticle(lexWikiNewsPage);
    }
}

