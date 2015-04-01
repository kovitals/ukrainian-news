chrome.alarms.create("ukrainian-news", {
    delayInMinutes: 0,
    periodInMinutes: parseInt(common.options.getUpdatePeriod())
});
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "ukrainian-news") {
        chrome.browserAction.setBadgeText ( { text: newsGenerator.requestNews().length.toString() } );
    }
});