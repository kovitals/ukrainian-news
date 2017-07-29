/**
 * Created by valer on 13.06.2017.
 */
export default class BrowserAPI {

    displayBadge(text){
        chrome.browserAction.setBadgeText({text: text});
    }

    clearAlarm(name){
        chrome.alarms.clear(name);
    }

    createAlarm(name, delayInMinutes, periodInMinutes = -1){

        this.clearAlarm(name);

        let alarmInfo = {};
        alarmInfo.delayInMinutes = parseInt(delayInMinutes);

        if(periodInMinutes != -1)
            alarmInfo.periodInMinutes = parseInt(periodInMinutes);

        console.log(name, delayInMinutes, periodInMinutes, alarmInfo);

        chrome.alarms.create(name, alarmInfo);
    }

    listenAlarm(callback){
        chrome.alarms.onAlarm.addListener(callback);
    }

    sendMessage(type, message) {
        chrome.runtime.sendMessage({type, message}, function (response) {
            // console.log(response);
        });
    }

    listenMessage(callback) {
        chrome.runtime.onMessage.addListener(callback);
    }

}