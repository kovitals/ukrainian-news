// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable with registered news rss-channels
 * 
 * @type {object}
 */
var NEWS_SOURCES_RSS = {
  up : "http://www.pravda.com.ua/rss/view_news/",
  lb : "http://lb.ua/export/rss.xml",
  lg : "http://news.liga.net/news/rss.xml",
  un : "http://rss.unian.net/site/news_rus.rss",
  cn : "http://censor.net.ua/includes/news_ru.xml",
  zn : "http://zn.ua/rss",
  fn : "http://news.finance.ua/rss",
  nv : "http://nv.ua/xml/rss.xml"
}

/**
 * Global variable with news provider
 *
 * @type {string}
 */
var LOCAL_STORAGE_KEY = 'ukrainian-news';

var newsGenerator = {

  /**
   * Load from local storage have read news items
   *
   * @returns {*}
   */
    getStoredNews: function() {
        if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
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
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(new Array(newsItem)));
      } else {
          var arr = newsGenerator.getStoredNews();
          arr.push(newsItem);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(arr));
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

      var request = new XMLHttpRequest();

      //todo: extract key storage to global variable
      // load from local storage rss-channels config
      if (localStorage.getItem('rss_channels_config')) {
        var rss_channels_config = JSON.parse(localStorage.getItem('rss_channels_config'));
      }

      // load read news
      var storedNewsItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

      var res = [];

      Object.keys(NEWS_SOURCES_RSS).forEach(function (key) {
        // retrieve data for enabled rss-channels or for all when no one selected
        if (rss_channels_config == null || rss_channels_config[key] === "true" || Object.getOwnPropertyNames(rss_channels_config).length === 0) {
            request.open("GET", NEWS_SOURCES_RSS[key], false);
            request.send();
            // check valid response
            if (request.readyState==4 && request.status == 200) {
                // checking valid XML in response
                if (request.responseXML != null) {
                    var result = request.responseXML.querySelectorAll('item');
                    for (var i = 0; i < result.length; i++) {
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
                'liveintegrationnew': 'nv',
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
        content.style.width = (localStorage.getItem('window_width_config') ? localStorage.getItem('window_width_config') : 600) + 'px';
        content.appendChild(newsFragment)

        chrome.browserAction.setBadgeText ( { text: (document.getElementById("content").childElementCount).toString() } );
  }
};