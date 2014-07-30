// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable with source of news
 * 
 * @type {string}
 */
var NEWS_SOURCES_RSS = [];

//todo: add storing selected source in option page and store to local storage
NEWS_SOURCES_RSS['up'] = 'http://www.pravda.com.ua/rss/view_news/';
NEWS_SOURCES_RSS['lb'] = 'http://lb.ua/export/rss_news.xml';
NEWS_SOURCES_RSS['lg'] = 'http://news.liga.net/news/rss.xml';
NEWS_SOURCES_RSS['un'] = 'http://rss.unian.net/site/news_rus.rss';


/**
 * Global variable with news provider
 *
 * @type {string}
 */
var LOCAL_STORAGE_KEY = 'pravda-last-news';

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


      //todo: Rewrite with cyrcle for whole source elements

      var req = new XMLHttpRequest();

      req.open("GET", NEWS_SOURCES_RSS['lb'], false);
      req.send();
      result = req.responseXML.querySelectorAll('item');

      req.open("GET", NEWS_SOURCES_RSS['lg'], false);
      req.send();
      result2 = req.responseXML.querySelectorAll('item');

      req.open("GET", NEWS_SOURCES_RSS['up'], false);
      req.send();
      result3 = req.responseXML.querySelectorAll('item');

      req.open("GET", NEWS_SOURCES_RSS['un'], false);
      req.send();
      result4 = req.responseXML.querySelectorAll('item');

      res = [];

      for (i = 0; i < result.length; i++) {

          rst = [];
          rst['date'] = result[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}')['input'];
          rst['title'] = result[i].querySelector('title').textContent;
          rst['link'] = result[i].querySelector('link').textContent;

          res[res.length] = rst;
      }


      for (i = 0; i < result2.length; i++) {

          rst = [];
          rst['date'] = result2[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}')['input'];
          rst['title'] = result2[i].querySelector('title').textContent;
          rst['link'] = result2[i].querySelector('link').textContent;

          res[res.length] = rst;
      }

      for (i = 0; i < result3.length; i++) {

          rst = [];
          rst['date'] = result3[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}')['input'];
          rst['title'] = result3[i].querySelector('title').textContent;
          rst['link'] = result3[i].querySelector('link').textContent;

          res[res.length] = rst;
      }

      for (i = 0; i < result4.length; i++) {

          rst = [];
          rst['date'] = result4[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}')['input'];
          rst['title'] = result4[i].querySelector('title').textContent;
          rst['link'] = result4[i].querySelector('link').textContent;

          res[res.length] = rst;
      }

      res.sort(function(a ,b) {
          return new Date(b.date) - new Date(a.date);
      })

      newsGenerator.showNews_(res);
    },

    markAsRead: function(title) {
        if (typeof title == 'string' || title instanceof String) {
            newsGenerator.addStoredNews(title);
        } else {
            newsGenerator.addStoredNews(this.getAttribute('name'));
            this.parentNode.remove();
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

        //console.log(news);

        // get fresh newfrom from RSS feed
        //var feedNewsItems = e.target.responseXML.querySelectorAll('item');

        // load have read news from local storage
        var storedNewsItems = JSON.parse(localStorage.getItem("pravda-last-news"));

        for (var i = 0; i < news.length; i++) {

            // get title of each news
            //var newsTitle = feedNewsItems[i].querySelector('title').textContent;

             // show only unread news items
            if (!newsGenerator.hasStoredNews(news[i]['title']))
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
                chk.setAttribute('name', news[i]['title']);
                chk.addEventListener('click', newsGenerator.markAsRead);

                var spn = document.createElement('span');
                spn.setAttribute('class', 'time');
                spn.innerText = news[i]['date'].match('[0-9]{2}:[0-9]{2}');

                var a = document.createElement('a');
                a.innerHTML = news[i]['title'];
                a.setAttribute("href",news[i]['link']);
                //a.setAttribute("href", "http://www.pravda.com.ua/rss/view_news/");
                a.addEventListener('click', function(){
                    newsGenerator.markAsRead(this.innerHTML);
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