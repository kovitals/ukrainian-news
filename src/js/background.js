import common from './common';
import newsGenerator from './news';

function initialize() {

    updateBadge();

    createAlarm();

    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name === "ukrainian-news")
            updateBadge();
    });

    // should be moved to Messenger;
    chrome.runtime.onMessage.addListener(messageHandler);
}

function messageHandler(request, sender, sendResponse) {
    console.log(request.type, request.message);

    switch (request.type)
    {
        case 'delay':
            createAlarm();
            break;
    }
}

function createAlarm() {
    console.log('createAlarm()');

    chrome.alarms.clear('ukrainian-news');

    chrome.alarms.create('ukrainian-news', {
        delayInMinutes: parseInt(common.options.getUpdatePeriod()),
        periodInMinutes: parseInt(common.options.getUpdatePeriod())
    });
}

function updateBadge() {
    chrome.browserAction.setBadgeText({
        text: newsGenerator.requestNews().length.toString()
    });
}

initialize();
