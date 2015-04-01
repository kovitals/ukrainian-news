var newsGenerator = {
  /**
   * Load from local storage have read news items
   *
   * @returns {*}
   */
    getStoredNews: function() {
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
    addStoredNews: function(newsItem) {
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
    hasStoredNews: function(newsitem) {
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
    requestNews: function() {
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
                request.open("GET", common.newsSources[key], false);
                request.send();
                // check valid response
                if (request.readyState == 4 && request.status == 200) {
                    // checking valid XML in response
                    if (request.responseXML != null) {
                        var result = request.responseXML.querySelectorAll('item');
                        for (var i = 0; i < result.length && i < common.options.getShowLastItems(); i++) {
                            // will show only unread news items
                            if (!newsGenerator.hasStoredNews(result[i].querySelector('link').textContent)) {
                                var rst = [];
                                rst['date'] = result[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}')['input'];
                                rst['title'] = result[i].querySelector('title').textContent;
                                rst['link'] = result[i].querySelector('link').textContent;
                                res[res.length] = rst;
                            }
                        }
                    }
                }
            }
        });
        // sorting news by date through all channels
        res.sort(function(a ,b) {
            return new Date(b.date) - new Date(a.date);
        })
        return res;
    },

    /**
     * 
     * @param url
     */
    markAsRead: function(url) {
        if (typeof url == 'string' || url instanceof String) {
            newsGenerator.addStoredNews(url);
            document.getElementsByName(url)[0].parentNode.remove();
        } else {
            newsGenerator.addStoredNews(this.getAttribute('name'));
            var container = this.parentNode.parentNode;
            this.parentNode.remove();
            if (container.childElementCount == 0) {
                window.close();
            }
        }
        chrome.browserAction.setBadgeText ( { text: (document.getElementById("content").childElementCount).toString() } );
    },

   /**
    * Mark all presents news in window as read
    */
    markAllAsRead: function() {
        var content = document.getElementById("content");
        for (var i = content.childElementCount; i >= 0; i--) {
            if (content.childNodes[i] && content.childNodes[i].childNodes[0]) {
                newsGenerator.addStoredNews(content.childNodes[i].childNodes[0].getAttribute('name'));
            }
        }
        content.innerHTML = "";
        chrome.browserAction.setBadgeText ( { text: "0" } );
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
            var li  = document.createElement('li');
            // Mapping URL of sites to an appropriate logo names in CSS style
            var URL_TO_LOGO = {
                'pravda.com.ua': 'up',
                'eurointegration.com.ua': 'up',
                'champion.com.ua': 'up',
                'lb.ua': 'lb',
                'liga.net': 'lg',
                'unian.net': 'un',
                'zn.ua': 'zn',
                'censor.net.ua': 'cn',
                'finance.ua': 'fn',
                'nv.ua': 'nv'
            };
            for (var url in URL_TO_LOGO){
                if (news[i]['link'].match(url)) {
                    var logo_name = URL_TO_LOGO[url];
                }
            }
            // Create checkbox element for marked read and hide item
            var chk = document.createElement('input');
            chk.setAttribute('type','checkbox');
            chk.setAttribute('name', news[i]['link']);
            chk.addEventListener('click', newsGenerator.markAsRead);
            li.appendChild(chk);
            // Create block for show time of news
            var spn = document.createElement('span');
            spn.setAttribute('class', 'time');
            spn.innerText = news[i]['date'].match('[0-9]{2}:[0-9]{2}');
            li.appendChild(spn);
            // Create element with logo of news site
            var logo = document.createElement('span');
            logo.setAttribute('class', 'logo ' + logo_name);
            li.appendChild(logo);
            // Create link element with a direct URL to news
            var a = document.createElement('a');
            a.innerHTML = news[i]['title'];
            a.setAttribute("href",news[i]['link']);
            a.setAttribute("title",news[i]['title']);
            a.addEventListener('click', function(){
                newsGenerator.markAsRead(this.getAttribute("href"));
                chrome.tabs.create({ url: this.getAttribute("href") });
            });
            li.appendChild(a);
            // Add created news item to window
            newsFragment.appendChild(li);
        }
        var content = document.getElementById("content");
        content.style.width = common.options.getWindowWith() + 'px';
        content.appendChild(newsFragment)
        chrome.browserAction.setBadgeText ( { text: (document.getElementById("content").childElementCount).toString() } );
  }
};