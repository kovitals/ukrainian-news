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



    markAsRead: function() {
        console.log(this.getAttribute('name'));
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

    // get last news from RSS feed
    var newsItems = e.target.responseXML.querySelectorAll('item');

    // load a read news from local storage
    var storedNewsItems = JSON.parse(localStorage.getItem("pravda-last-news"));

    //
    for (var i = 0; i < newsItems.length; i++) {

         // show only unread news items
        if (storedNewsItems.indexOf(newsItems[i].querySelector('title').textContent) == -1)
        {
            var li  = document.createElement('li');

            var chk = document.createElement('input');
            chk.setAttribute('type','checkbox');
            chk.setAttribute('name',newsItems[i].querySelector('title').textContent);
            chk.addEventListener('click', this.markAsRead);

            var spn = document.createElement('span');
            spn.innerText = newsItems[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}');

            var a = document.createElement('a');
            a.innerHTML = newsItems[i].querySelector('title').textContent;
            a.setAttribute('href',newsItems[i].querySelector('guid').textContent);

            li.appendChild(chk);
            li.appendChild(spn);
            li.appendChild(a);

            document.getElementById("content").appendChild(li);

            //document.querySelector('input').addEventListener('change', changeHandler);
        }
        //forStoreItems.push(newsitems[i].querySelector('title').textContent);

    }

     //console.log(storedItems);

     //localStorage.setItem("pravda-last-news",JSON.stringify(storedItems));

     //var currentdate = new Date();
     //document.getElementById('currdate').innerHTML = " " + currentdate.getHours() + ":" + currentdate.getMinutes();
  }





};

// Run our news generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
    newsGenerator.requestNews();
});
