import common from './common';
import newsGenerator from './news';

// TODO should be used chrome.runtime.sendMessage to communicate with view;

function initialize() {
    updateBadge();

    chrome.alarms.create("ukrainian-news", {
        delayInMinutes: 1,
        periodInMinutes: common.options.getUpdatePeriod()
    });

    chrome.alarms.onAlarm.addListener(function (alarm) {

        if (alarm.name === "ukrainian-news")
            updateBadge();

    });
}

function updateBadge() {
    chrome.browserAction.setBadgeText({
        text: newsGenerator.requestNews().length.toString()
    });
}

initialize();
