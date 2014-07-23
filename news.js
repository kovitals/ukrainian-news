// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable with source of news
 * 
 * @type {string}
 */
var HTTP_SOURCE_NEWS = 'http://www.pravda.com.ua/rss/view_news/';
//var HTTP_SOURCE_NEWS = 'http://localhost/pravda.xml';

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
            //console.log(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));
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
        req.open("GET", HTTP_SOURCE_NEWS, true);
        req.onload = this.showNews_.bind(this);
        req.send(null);
    },


    markAsRead: function() {
        newsGenerator.addStoredNews(this.getAttribute('name'));
        this.parentNode.remove();
    },

 /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestKittens', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
    showNews_: function (e) {

        // get fresh newfrom from RSS feed
        var feedNewsItems = e.target.responseXML.querySelectorAll('item');

        // load have read news from local storage
        var storedNewsItems = JSON.parse(localStorage.getItem("pravda-last-news"));

        for (var i = 0; i < feedNewsItems.length; i++) {

            // get title of each news
            var newsTitle = feedNewsItems[i].querySelector('title').textContent;

             // show only unread news items
            if (!newsGenerator.hasStoredNews(newsTitle))
            {
                var li  = document.createElement('li');

                var chk = document.createElement('input');
                chk.setAttribute('type','checkbox');
                chk.setAttribute('name', newsTitle);
                chk.addEventListener('click', newsGenerator.markAsRead);

                var spn = document.createElement('span');
                spn.innerText = feedNewsItems[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}');

                var a = document.createElement('a');
                a.innerHTML = newsTitle;
                a.setAttribute('href',feedNewsItems[i].querySelector('guid').textContent);

                li.appendChild(chk);
                li.appendChild(spn);
                li.appendChild(a);

                document.getElementById("content").appendChild(li);
            }
        }
  //var currentdate = new Date();
     //document.getElementById('currdate').innerHTML = " " + currentdate.getHours() + ":" + currentdate.getMinutes();
  }

};

// Run our news generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  newsGenerator.requestNews();
});