// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable with source of news
 * 
 * @type {string}
 */
var HTTP_SOURCE_NEWS = 'http://www.pravda.com.ua/rss/view_news/';

/**
 * Global variable with news provider
 *
 * @type {string}
 */
var LOCAL_STORAGE_KEY = 'last-news';

/**
 * Global variable wit the max string length for news items in popup window
 *
 * @type {number}
 */
var NEWS_ROW_MAX_LENGTH = 60;


/**
 * Global variable for store loaded data from local storage
 *
 * @type {array}
 */
var LOCAL_STORAGE_CACHE = Array();

var newsGenerator = {

  /**
   * Load from local storage have read news items
   *
   * @returns {*}
   */
  getStoredNews: function() {
    if (!LOCAL_STORAGE_CACHE) {
      LOCAL_STORAGE_CACHE = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    }
    return LOCAL_STORAGE_CACHE;
  },


  /**
   * Save have read news to local storage
   *
   * @param news
   */
  setStoredNews: function(news) {
    if (LOCAL_STORAGE_CACHE) {
      LOCAL_STORAGE_CACHE = news;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(news));
  },

  /**
   * Save one news item to local storage as have read
   *
   * @param newsitem
   */
  addStoredNews: function(newsitem) {
    this.setStoredNews(this.getStoredNews().push(newsitem));
  },


  /**
   * Check if provided news item have already read and exist in local storage
   *
   * @param newsitem
   */
  hasStoredNews: function(newsitem) {
    return this.getStoredNews().indexOf(newsitem) > 0;
  },

  /**
   * Check actual status of stored news. Remove obsolete items which not receive from rss feeds
   *
   * @param news
   */
  cleanUpStorage: function(news) {
    var storedNews = this.getStoredNews();
    for (var i = 0; storedNews.length > i; i++) {
      if (news.indexOf(storedNews[i]) == 0) {
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


 /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestKittens', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  showNews_: function (e) {

    this.cleanUpStorage(e.target.responseXML.querySelectorAll('title'));

    var feedNewsItems = e.target.responseXML.querySelectorAll('guid');

    for (var i = 0; i < feedNewsItems.length; i++) {
        var id  = feedNewsItems[i].querySelector('guid').textContent;

        if (!this.hasStoredNews(id))
        {
            var li  = document.createElement('li');
            li.setAttribute('id', 'li['+id+']');

            var img = document.createElement('img');
            img.src = "favicon.png";

            var chk = document.createElement('input');
            chk.setAttribute('type','checkbox');
            chk.setAttribute('id',''+feedNewsItems[i].querySelector('guid').textContent);
            chk.addEventListener('click', function() {
                document.getElementById('li['+this.id+']').remove();
                this.addStoredNews(this.id);
            });

            var spn = document.createElement('span');
            spn.innerText = feedNewsItems[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}');

            var a = document.createElement('a');
            a.setAttribute('title', feedNewsItems[i].querySelector('title').textContent);
            if (feedNewsItems[i].querySelector('title').textContent.length > NEWS_ROW_MAX_LENGTH) {
                feedNewsItems[i].querySelector('title').textContent.substr(0, NEWS_ROW_MAX_LENGTH).concat('...');
            }
            a.innerHTML = feedNewsItems[i].querySelector('title').textContent;
            a.setAttribute('href',feedNewsItems[i].querySelector('guid').textContent);

            li.appendChild(chk);
            li.appendChild(spn);
            li.appendChild(img);
            li.appendChild(a);

            document.getElementById("content").appendChild(li);
        }
    }
  }
};

// Run our news generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  newsGenerator.requestNews();
});


