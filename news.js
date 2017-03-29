var newsGenerator = {
    /**
     * Load from local storage have read news items
     *
     * @returns {*}
     */
    getStoredNews: function () {
        if (localStorage.getItem(common.storageKey.readNews)) {
            return JSON.parse(localStorage.getItem(common.storageKey.readNews));
        }
        return false;
    },

    /**
     * Save one news item to local storage as have read
     *
     * @param newsItem
     */
    addStoredNews: function (newsItem) {
        if (newsGenerator.getStoredNews() == false) {
            localStorage.setItem(common.storageKey.readNews, JSON.stringify(new Array(newsItem)));
        } else {
            var arr = newsGenerator.getStoredNews();
            arr.push(newsItem);
            localStorage.setItem(common.storageKey.readNews, JSON.stringify(arr));
        }
    },

    /**
     * Check if provided news item have already read and exist in local storage
     *
     * @param newsitem
     */
    hasStoredNews: function (newsitem) {
        if (this.getStoredNews()) {
            return (this.getStoredNews().indexOf(newsitem) > -1);
        }
        return false;
    },

    /**
     * Sends an XHR GET request to grab last new from RSS feed of pravda.com.ua. The
     * XHR's 'onload' event is hooks up to the 'showNews_' method.
     *
     * @public
     */
    requestNews: function () {
        // create request object
        var request = new XMLHttpRequest();
        // load from local storage rss-channels config
        var rss_channels_config = JSON.parse(common.options.getRSSChannels());
        // define result
        var res = [];


        // request news per rss channel
        Object.keys(common.newsSources).forEach(function (key) {
            // retrieve data for enabled rss-channels or for all when no one selected
            if (rss_channels_config == null || rss_channels_config[key] === "true" || Object.getOwnPropertyNames(rss_channels_config).length === 0) {
                try {
                    request.open("GET", common.newsSources[key].rss, false);
                    request.send();
                    // check valid response
                    if (request.readyState == 4 && request.status == 200) {
                        // checking valid XML in response
                        if (request.responseXML != null || request.responseText != null) {
                            if (request.responseXML != null) {
                                var result = request.responseXML.querySelectorAll('item');
                            }
                            // fix for case when rss return result without XML content type
                            if (request.responseXML == null && request.responseText != null) {
                                var parser = new DOMParser();
                                var result = parser.parseFromString(request.responseText, "text/xml").querySelectorAll('item');
                            }
                            for (var i = 0; i < result.length && i < common.options.getShowLastItems(); i++) {
                                // will show only unread news items
                                if (!newsGenerator.hasStoredNews(result[i].querySelector('link').textContent)) {
                                    var rst = [];
                                    rst['key'] = key;
                                    rst['date'] = result[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}')['input'];
                                    rst['title'] = result[i].querySelector('title').textContent;
                                    rst['link'] = result[i].querySelector('link').textContent;
                                    res[res.length] = rst;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log("Channel " + common.newsSources[key].rss + " temporary unavailable.")
                }
            }
        });
        // sorting news by date through all channels
        res.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        return res;
    },

    /**
     * Mark item as read and hide element from list
     * @param url
     */
    markAsRead: function (url) {
        if (typeof url !== 'string' && !(url instanceof String)) {
            url = this.getAttribute('name');
        }
        newsGenerator.addStoredNews(url);
        document.getElementsByName(url)[0].parentNode.remove();
        if (document.getElementById("content").childElementCount == 0) {
            window.close();
        }
        chrome.browserAction.setBadgeText({text: (document.getElementById("content").childElementCount).toString()});
    },

    /**
     * Mark all presents news in window as read
     */
    markAllAsRead: function () {
        var content = document.getElementById("content");
        for (var i = content.childElementCount; i >= 0; i--) {
            if (content.childNodes[i] && content.childNodes[i].childNodes[0]) {
                newsGenerator.addStoredNews(content.childNodes[i].childNodes[0].getAttribute('name'));
            }
        }
        content.innerHTML = "";
        chrome.browserAction.setBadgeText({text: "0"});
        window.close();
    },

    /**
     *
     * @param {ProgressEvent} e The XHR ProgressEvent.
     * @private
     */
    showNews_: function (news) {
        var newsFragment = document.createDocumentFragment();
        for (var i = 0; i < news.length; i++) {
            var li = document.createElement('li');
            // Create element with link to hide element
            var hideItemLink = document.createElement('a');
            hideItemLink.setAttribute('class', 'logo hideItem');
            hideItemLink.setAttribute('href', '#');
            hideItemLink.setAttribute('title', 'Відмітити як прочитане');
            hideItemLink.setAttribute('name', news[i]['link']);
            hideItemLink.addEventListener('click', newsGenerator.markAsRead);
            li.appendChild(hideItemLink);
            // Create element with link to open in background
            var newTabLink = document.createElement('a');
            newTabLink.setAttribute('class', 'logo newTab');
            newTabLink.setAttribute("href", news[i]['link']);
            newTabLink.setAttribute('title', 'Прочитати пізніше');
            newTabLink.addEventListener('click', function () {
                chrome.tabs.create({url: this.getAttribute("href"), active: false});
                newsGenerator.markAsRead(this.getAttribute("href"));
            });
            li.appendChild(newTabLink);
            // Create block for show time of news
            var spn = document.createElement('span');
            spn.setAttribute('class', 'time');
            //fix for broken rss format date
            var newsdate = news[i]['date'].match('[0-9]{1,2}:[0-9]{2}');
            if (newsdate && newsdate[0].length == 4) {
                newsdate[0] = '0' + newsdate[0];
            }
            //end dirty fix
            spn.innerText = newsdate[0];
            li.appendChild(spn);
            // Create element with logo of news site
            var logo = document.createElement('span');
            logo.setAttribute('class', 'logo');
            logo.setAttribute('style', 'background: url("img/' + news[i]['key'] + '-icon.ico") no-repeat 4px 0px;');
            li.appendChild(logo);
            // Create link element with a direct URL to news
            var a = document.createElement('a');
            a.innerHTML = news[i]['title'];
            a.setAttribute("href", news[i]['link']);
            a.setAttribute("title", news[i]['title']);
            a.addEventListener('click', function () {
                newsGenerator.markAsRead(this.getAttribute("href"));
                chrome.tabs.create({url: this.getAttribute("href"), active: true});
            });
            li.appendChild(a);
            // Add created news item to window
            newsFragment.appendChild(li);
        }
        var content = document.getElementById("content");
        content.style.width = common.options.getWindowWidth() + 'px';
        content.appendChild(newsFragment)
        chrome.browserAction.setBadgeText({text: (document.getElementById("content").childElementCount).toString()});
    }
};

document.addEventListener('DOMContentLoaded', function () {
    newsGenerator.showNews_(newsGenerator.requestNews());
    document.getElementById('readall').addEventListener('click', newsGenerator.markAllAsRead);
});