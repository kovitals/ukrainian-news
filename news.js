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
 * Global variable with extension storage key
 *
 * @type {string}
 */
var STORAGE_LOCAL_KEY = 'pravda-last-news';

var newsGenerator = {

    /* work with local storage
        if key exist then do nothing
        if key not exist then add them
     */
    mergeToStorage: function(key) {

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

    var newsitems = e.target.responseXML.querySelectorAll('item');

     storedNewsItems = JSON.parse(localStorage.getItem("pravda-last-news"));

     for (var i = 0; i < newsitems.length; i++) {


         // show only unread news items
        if (storedNewsItems.indexOf(newsitems[i].querySelector('title').textContent)==0)
        {
            var li  = document.createElement('li');

            var chk = document.createElement('input');
            chk.setAttribute('type','checkbox');
            chk.setAttribute('name','hide[http://www.pravda.com.ua/news/2014/07/3/7030881/]');

            var spn = document.createElement('span');
            spn.innerText = newsitems[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}');

            var a = document.createElement('a');
            a.innerHTML = newsitems[i].querySelector('title').textContent;
            a.setAttribute('href',newsitems[i].querySelector('guid').textContent);

            li.appendChild(chk);
            li.appendChild(spn);
            li.appendChild(a);

            document.getElementById("content").appendChild(li);
        }

        forStoreItems.push(newsitems[i].querySelector('title').textContent);

    }

     //console.log(storedItems);

     localStorage.setItem("pravda-last-news",JSON.stringify(storedItems));

     //localStorage.
     //var currentdate = new Date();
     //document.getElementById('currdate').innerHTML = " " + currentdate.getHours() + ":" + currentdate.getMinutes();
  }

};

// Run our news generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  newsGenerator.requestNews();
});