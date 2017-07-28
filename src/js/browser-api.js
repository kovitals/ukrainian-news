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

    createAlarm(name, periodInMinutes){

        this.clearAlarm(name);

        chrome.alarms.create(name, {
            delayInMinutes: parseInt(periodInMinutes),
            periodInMinutes: parseInt(periodInMinutes)
        });

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