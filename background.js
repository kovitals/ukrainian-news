var alarmName = "ukrainian-news";
var periodMin = 10;
if (localStorage.getItem('background_period_config')) {
    periodMin = parseInt(localStorage.getItem('background_period_config'));

}

chrome.alarms.create(alarmName, {
    delayInMinutes: 0,
    periodInMinutes: periodMin
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === alarmName) {
        alert('alarm!');
        chrome.browserAction.setBadgeText ( { text: newsGenerator.requestNews().length.toString() } );
    }
});