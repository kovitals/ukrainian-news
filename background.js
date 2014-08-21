// default value for undefined option
var periodMin = 30;

// load configured period parameter if it exist
if (localStorage.getItem('background_period_config')) {
    periodMin = parseInt(localStorage.getItem('background_period_config'));
}

chrome.alarms.create("ukrainian-news", {
    delayInMinutes: 0,
    periodInMinutes: periodMin
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "ukrainian-news") {
        chrome.browserAction.setBadgeText ( { text: newsGenerator.requestNews().length.toString() } );
    }
});