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
  un : "http://rss.unian.net/site/news_rus.rss"
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
   * Check actual status of stored news. Remove obsolete items which not receive from rss feeds
   *
   * @param news
   */
  cleanUpStoredNews: function(news) {
    var storedNews = this.getStoredNews();
    for (var i = 0; storedNews.length > i; i++) {
      if (news.indexOf(storedNews[i]) == -1) {
        storedNews.remove();
      }
    }
    this.setStoredNews(storedNews);
  },


  /**
   * Sends an XHR GET request to grab last new from RSS feed of pravda.com.ua. The
   * XHR's 'onload' event is hooks up to the 'showNews_' method.
   *
   * @public
   */
    requestNews: function() {

      var req = new XMLHttpRequest();

      //todo: extract key storage to global variable
      // load from local storage rss-channels config
      if (localStorage.getItem('rss_channels_config')) {
        var rss_channels_config = JSON.parse(localStorage.getItem('rss_channels_config'));
      }

      var res = [];

      Object.keys(rss_channels_config).forEach(function (key) {

        // retrieve data for enabled rss-channels
        if (rss_channels_config[key] === "true") {
          req.open("GET", NEWS_SOURCES_RSS[key], false);
          req.send();
          var result = req.responseXML.querySelectorAll('item');

          for (var i = 0; i < result.length; i++) {
            var rst = [];
            rst['date'] = result[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}')['input'];
            rst['title'] = result[i].querySelector('title').textContent;
            rst['link'] = result[i].querySelector('link').textContent;
            res[res.length] = rst;
          }
        }
      });

      res.sort(function(a ,b) {
          return new Date(b.date) - new Date(a.date);
      })

      newsGenerator.showNews_(res);
    },

    /**
     * 
     * @param url
     */
    markAsRead: function(url) {
        if (typeof url == 'string' || url instanceof String) {
            newsGenerator.addStoredNews(url);
        } else {
            newsGenerator.addStoredNews(this.getAttribute('name'));
            var container = this.parentNode.parentNode;
            this.parentNode.remove();
            if (container.childElementCount == 0) {
                window.close();
            }
        }
    },

 /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestKittens', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
    showNews_: function (news) {

        // load have read news from local storage
        var storedNewsItems = JSON.parse(localStorage.getItem("pravda-last-news"));

        for (var i = 0; i < news.length; i++) {

             // show only unread news items, check by news url
            if (!newsGenerator.hasStoredNews(news[i]['link']))
            {
                var li  = document.createElement('li');

                var logo = document.createElement('span');

                // todo: Refactoring for more proper solution
                if (news[i]['link'].match('pravda.com.ua')) {
                    var logo_name = 'up';
                }

                if (news[i]['link'].match('lb.ua')) {
                    var logo_name = 'lb';
                }

                if (news[i]['link'].match('liga.net')) {
                    var logo_name = 'lg';
                }

                if (news[i]['link'].match('unian.net')) {
                    var logo_name = 'un';
                }
                // end

                logo.setAttribute('class', 'logo ' + logo_name);

                var chk = document.createElement('input');
                chk.setAttribute('type','checkbox');
                chk.setAttribute('name', news[i]['link']);
                chk.addEventListener('click', newsGenerator.markAsRead);

                var spn = document.createElement('span');
                spn.setAttribute('class', 'time');
                spn.innerText = news[i]['date'].match('[0-9]{2}:[0-9]{2}');

                var a = document.createElement('a');

                if (news[i]['title'].length > 65) {
                    a.innerHTML = news[i]['title'].substr(0,65) + '...';;
                }
                else {
                    a.innerHTML = news[i]['title'];
                }

                a.setAttribute("href",news[i]['link']);
                a.setAttribute("title",news[i]['title']);

                a.addEventListener('click', function(){
                    newsGenerator.markAsRead(this.getAttribute("href"));
                    chrome.tabs.create({ url: this.getAttribute("href") });
                });

                li.appendChild(chk);
                li.appendChild(spn);
                li.appendChild(logo);
                li.appendChild(a);

                document.getElementById("content").appendChild(li);
            }
        }

  }

};

// Run our news generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  newsGenerator.requestNews();
    chrome.browserAction.setBadgeText ( { text: "15" } );
});

document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});