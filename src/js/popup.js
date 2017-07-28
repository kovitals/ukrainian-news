import newsGenerator from './news';
import common from './common';
import ga from './analytics/ga';
import BrowserAPI from "./browser-api";
import MessageTypes from "./types/message-types";

var browserAPI;

// initialize Google Analytics;
ga();

/**
 * Mark item as read and hide element from list
 * @param url
 */
function markAsRead(url) {

    if (typeof url !== 'string' && !(url instanceof String)) {
        url = this.getAttribute('name');
    }

    common.options.addStoredNews(url);

    document.getElementsByName(url)[0].parentNode.remove();

    if (document.getElementById("content").childElementCount == 0) {
        window.close();
    }

    chrome.browserAction.setBadgeText({text: (document.getElementById("content").childElementCount).toString()});
}

/**
 * Mark all presents news in window as read
 */
function markAllAsRead() {
    var content = document.getElementById("content");

    for (var i = content.childElementCount; i >= 0; i--) {

        if (content.childNodes[i] && content.childNodes[i].childNodes[0]) {
            common.options.addStoredNews(content.childNodes[i].childNodes[0].getAttribute('name'));
        }

    }

    content.innerHTML = "";

    chrome.browserAction.setBadgeText({text: "0"});

    window.close();
}

/**
 *
 * @param {ProgressEvent} e The XHR ProgressEvent.
 * @private
 */
function showNews(news) {

    var newsFragment = document.createDocumentFragment();

    for (var i = 0; i < news.length; i++) {
        var li = document.createElement('li');
        // Create element with link to hide element
        var hideItemLink = document.createElement('a');
        hideItemLink.setAttribute('class', 'logo hideItem');
        hideItemLink.setAttribute('href', '#');
        hideItemLink.setAttribute('title', 'Відмітити як прочитане');
        hideItemLink.setAttribute('name', news[i]['link']);
        hideItemLink.addEventListener('click', markAsRead);
        li.appendChild(hideItemLink);
        // Create element with link to open in background
        var newTabLink = document.createElement('a');
        newTabLink.setAttribute('class', 'logo newTab');
        newTabLink.setAttribute("href", news[i]['link']);
        newTabLink.setAttribute('title', 'Прочитати пізніше');
        newTabLink.addEventListener('click', function () {
            chrome.tabs.create({url: this.getAttribute("href"), active: false});
            markAsRead(this.getAttribute("href"));
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
            markAsRead(this.getAttribute("href"));
            chrome.tabs.create({url: this.getAttribute("href"), active: true});
        });
        li.appendChild(a);
        // Add created news item to window
        newsFragment.appendChild(li);
    }

    var content = document.getElementById("content");
    content.style.width = common.options.getWindowWidth() + 'px';
    content.appendChild(newsFragment);

    chrome.browserAction.setBadgeText({text: (document.getElementById("content").childElementCount).toString()});
}

function messageHandler(request, sender, sendResponse) {

    switch (request.type) {
        case MessageTypes.UPDATE_NEWS:
            console.log(request.message);
            // showNews(request.message);
            break;
    }

}

document.addEventListener('DOMContentLoaded', function () {

    console.log('DOMContentLoaded');

    browserAPI = new BrowserAPI();
    browserAPI.listenMessage(messageHandler);
    browserAPI.sendMessage(MessageTypes.REQUEST_NEWS, null);

    document.getElementById('readall').addEventListener('click', markAllAsRead);

});