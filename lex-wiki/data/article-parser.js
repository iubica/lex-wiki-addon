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


function lexWikiParseNewYorkTimesArticle() {
    var url="", hdl="", authors="", date="", descr="";
    var metas = document.getElementsByTagName("meta");
    for (i=0; i < metas.length; i++) {
	if (metas[i].getAttribute("property") == "twitter:url") {
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
	    var date_raw = spans[i].getAttribute("datetime");
	    
	    if (date_raw) {
		var d = new Date(date_raw);
		date = lexWikiFormatDate(d);
	    }
	}
    }
    
    // Get the authors
    for (i=0; i < authorArray.length; i++) {
	if (i == 0) {
	    authors += authorArray[0];
	} else if (i == authorArray.length - 1) {
	    authors += ", and " + authorArray[i];
	} else {
	    authors += ", " + authorArray[i];
	}
    }

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
	if (metas[i].getAttribute("name") == "article.published") {
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
    for (i=0; i < authorArray.length; i++) {
	if (i == 0) {
	    authors += authorArray[0];
	} else if (i == authorArray.length - 1) {
	    authors += ", and " + authorArray[i];
	} else {
	    authors += ", " + authorArray[i];
	}
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
    for (i=0; i < authorArray.length; i++) {
	if (i == 0) {
	    authors += authorArray[0];
	} else if (i == authorArray.length - 1) {
	    authors += ", and " + authorArray[i];
	} else {
	    authors += ", " + authorArray[i];
	}
    }

    self.postMessage(["Boston Globe", url, hdl, authors, date, descr]);    
}

function lexWikiParseBostonHeraldArticle() {
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
    for (i=0; i < authorArray.length; i++) {
	if (i == 0) {
	    authors += authorArray[0];
	} else if (i == authorArray.length - 1) {
	    authors += ", and " + authorArray[i];
	} else {
	    authors += ", " + authorArray[i];
	}
    }

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
    for (i=0; i < authorArray.length; i++) {
	if (i == 0) {
	    authors += authorArray[0];
	} else if (i == authorArray.length - 1) {
	    authors += ", and " + authorArray[i];
	} else {
	    authors += ", " + authorArray[i];
	}
    }

    self.postMessage(["The Commonwealth", url, hdl, authors, date, descr]);    
}

function lexWikiParseReutersArticle() {
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
    for (i=0; i < authorArray.length; i++) {
	if (i == 0) {
	    authors += authorArray[0];
	} else if (i == authorArray.length - 1) {
	    authors += ", and " + authorArray[i];
	} else {
	    authors += ", " + authorArray[i];
	}
    }

    self.postMessage(["The Intercept", url, hdl, authors, date, descr]);    
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
    for (i=0; i < authorArray.length; i++) {
	if (i == 0) {
	    authors += authorArray[0];
	} else if (i == authorArray.length - 1) {
	    authors += ", and " + authorArray[i];
	} else {
	    authors += ", " + authorArray[i];
	}
    }

    self.postMessage(["Reuters", url, hdl, authors, date, descr]);    
}


function lexWikiParseArsTechicaArticle() {
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
    for (i=0; i < authorArray.length; i++) {
	if (i == 0) {
	    authors += authorArray[0];
	} else if (i == authorArray.length - 1) {
	    authors += ", and " + authorArray[i];
	} else {
	    authors += ", " + authorArray[i];
	}
    }

    self.postMessage(["Ars Technica", url, hdl, authors, date, descr]);    
}
