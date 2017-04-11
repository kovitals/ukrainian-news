import Common from './common';

var common = Common();

chrome.alarms.create("ukrainian-news", {
    delayInMinutes: 0,
    periodInMinutes: parseInt(common.options.getUpdatePeriod())
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "ukrainian-news") {
        console.log('newsGenerator');
        // chrome.browserAction.setBadgeText({text: newsGenerator.requestNews().length.toString()});
    }
});