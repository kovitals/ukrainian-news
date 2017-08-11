import '../../vendor/materialize-src/js/bin/materialize';
import ga from './analytics/ga';
import BrowserAPI from "./browser/browser-api";
import MessageTypes from "./types/message-types";
import SettingsStorage from "./settings/settings-storage";
import DropdownButtonType from "./types/dropdown-button-type";
import NewsView from "./news/news-view";
import NavBarView from "./news/nav-bar-view";

var browserAPI;
/**
 * @type SettingsStorage
 */
var settingsStorage;
var newsView;
var navBarView;

$(document).ready(function () {
    initialize();
});

function initialize() {
    ga();

    newsView = new NewsView("p-news-list");

    navBarView = new NavBarView();
    navBarView.registerMenuClickHandler(navBarMenuClickHandler);

    settingsStorage = new SettingsStorage();

    browserAPI = new BrowserAPI();
    browserAPI.listenMessage(messageHandler);

    updateSize();
    requestNews();
}

function navBarMenuClickHandler(button) {
    switch (button.id){
        case DropdownButtonType.UPDATE:
            newsView.removeAllItems();
            requestNews();
            break;
        case DropdownButtonType.SETTINGS:
            browserAPI.openSettingsPage();
            break;
        case DropdownButtonType.MARK_ALL:
            newsView.removeAllItems();
            break;
        case DropdownButtonType.RATE:
            browserAPI.openReviewsPage();
            break;
    }
}

function messageHandler(request, sender, sendResponse) {
    switch (request.type) {
        case MessageTypes.UPDATE_NEWS_COMPLETE:
            newsView.removeAllItems();

            // for test;
            // settingsStorage.addMarkedNews(request.message[0].link, request.message[0].date);

            newsView.displayNews(request.message);
            break;
    }
}

function updateSize() {
    let body = document.getElementById('p-body');

    settingsStorage.getWindowWidth().then((value)=>{
        body.style.width = value + 'px';
    });
}

function requestNews() {
    browserAPI.sendMessage(MessageTypes.REQUEST_NEWS);
}





















/**
 * Mark item as read and hide element from list
 * @param url
 */
function markAsRead(url) {

    if (typeof url !== 'string' && !(url instanceof String)) {
        url = this.getAttribute('name');
    }

    // settingsStorage.addStoredNews(url);

    document.getElementsByName(url)[0].parentNode.remove();

    if (document.getElementById("content").childElementCount == 0) {
        window.close();
    }
}

/**
 * Mark all presents news in window as read
 */
function markAllAsRead() {
    var content = document.getElementById("content");

    for (var i = content.childElementCount; i >= 0; i--) {

        if (content.childNodes[i] && content.childNodes[i].childNodes[0]) {
            // settingsStorage.addStoredNews(content.childNodes[i].childNodes[0].getAttribute('name'));
        }

    }

    content.innerHTML = "";

    chrome.browserAction.setBadgeText({text: "0"});

    window.close();
}



    // for (var i = 0; i < news.length; i++) {
    //     var li = document.createElement('li');
    //     // Create element with link to hide element
    //     var hideItemLink = document.createElement('a');
    //     hideItemLink.setAttribute('class', 'logo hideItem');
    //     hideItemLink.setAttribute('href', '#');
    //     hideItemLink.setAttribute('title', 'Відмітити як прочитане');
    //     hideItemLink.setAttribute('name', news[i]['link']);
    //     hideItemLink.addEventListener('click', markAsRead);
    //     li.appendChild(hideItemLink);
    //     // Create element with link to open in background
    //     var newTabLink = document.createElement('a');
    //     newTabLink.setAttribute('class', 'logo newTab');
    //     newTabLink.setAttribute("href", news[i]['link']);
    //     newTabLink.setAttribute('title', 'Прочитати пізніше');
    //     newTabLink.addEventListener('click', function () {
    //         chrome.tabs.create({url: this.getAttribute("href"), active: false});
    //         markAsRead(this.getAttribute("href"));
    //     });
    //     li.appendChild(newTabLink);
    //     // Create block for show time of news
    //     var spn = document.createElement('span');
    //     spn.setAttribute('class', 'time');
    //     //fix for broken rss format date
    //     var newsdate = news[i]['date'].match('[0-9]{1,2}:[0-9]{2}');
    //     if (newsdate && newsdate[0].length == 4) {
    //         newsdate[0] = '0' + newsdate[0];
    //     }
    //     //end dirty fix
    //     spn.innerText = newsdate[0];
    //     li.appendChild(spn);
    //     // Create element with logo of news site
    //     var logo = document.createElement('span');
    //     logo.setAttribute('class', 'logo');
    //     logo.setAttribute('style', 'background: url("img/' + news[i]['key'] + '-icon.ico") no-repeat 4px 0px;');
    //     li.appendChild(logo);
    //     // Create link element with a direct URL to news
    //     var a = document.createElement('a');
    //     a.innerHTML = news[i]['title'];
    //     a.setAttribute("href", news[i]['link']);
    //     a.setAttribute("title", news[i]['title']);
    //     a.addEventListener('click', function () {
    //         markAsRead(this.getAttribute("href"));
    //         chrome.tabs.create({url: this.getAttribute("href"), active: true});
    //     });
    //     li.appendChild(a);
