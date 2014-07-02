// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable with source of news
 * 
 * @type {string}
 */
var HTTP_SOURCE_NEWS = 'http://www.pravda.com.ua/rss/view_news/';

var newsGenerator = {
  
  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'showPhotos_' method.
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
    for (var i = 0; i < newsitems.length; i++) {
    	console.log(newsitems[i]);
      var p = document.createElement('p');
      p.innerHTML = newsitems[i][title];
      //img.src = this.constructKittenURL_(kittens[i]);
      //img.setAttribute('alt', kittens[i].getAttribute('title'));
      document.body.appendChild(p);
    }
  },

};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  newsGenerator.requestNews();
});