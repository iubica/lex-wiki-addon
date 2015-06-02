function lexWikiParseNewYorkTimesArticle() {
    var url="", hdl="", authors="", date="", descr="";
    var metas = document.getElementsByTagName("meta");
    for (i=0; i<metas.length; i++) {
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
    var metas = document.getElementsByTagName("meta");
    for (i=0; i<metas.length; i++) {
	if (metas[i].getAttribute("property") == "og:url") {
	    url = metas[i].getAttribute("content");
	}
	if (metas[i].getAttribute("property") == "og:title") {
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
    
    // Author, date, descr to be retrieved in a different way

    self.postMessage(["Washington Post", url, hdl, authors, date, descr]);    
}