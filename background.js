var alarmName = "ukrainian-news";

chrome.alarms.create(alarmName, {
    delayInMinutes: 0,
    periodInMinutes: 10
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === alarmName) {
        chrome.browserAction.setBadgeText ( { text: newsGenerator.requestNews().length.toString() } );
    }
});