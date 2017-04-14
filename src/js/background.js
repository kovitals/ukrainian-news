import Common from './common/common';
// import News from './news';
import Tracker from './background/tracker';

var common = Common();
// var news = News();
var ga = Tracker();

console.log('HW. ' + common.options.getUpdatePeriod());

chrome.alarms.create("ukrainian-news", {
    delayInMinutes: 1,
    periodInMinutes: parseInt(common.options.getUpdatePeriod())
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "ukrainian-news") {
        chrome.browserAction.setBadgeText({
             text: '22' //news.newsGenerator.requestNews().length.toString()
        });
    }
});