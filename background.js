var wifiAlarmName = "wifiSignIn";

chrome.alarms.create(wifiAlarmName, {
    delayInMinutes: 0,
    periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === wifiAlarmName) {
        // Sign in
        //alert("Alarm");
        //var newsCount = newsGenerator.showNewsCount_();
        //chrome.browserAction.setBadgeText ( { text: newsCount } );
    }
});