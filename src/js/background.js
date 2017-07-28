import common from './common';
import newsGenerator from './news';
import BrowserAPI from "./browser-api";
import SettingTypes from "./types/setting-types";
import AlarmTypes from "./types/alarm-types";
import MessageTypes from "./types/message-types";

var browserAPI;

function initialize() {

    browserAPI = new BrowserAPI();

    browserAPI.listenAlarm(alarmHandler);

    browserAPI.listenMessage(messageHandler);

    createAlarm();

    requestNews();
}

function alarmHandler(alarm) {

    console.log('alarmHandler(', alarm.name, ')');

    switch (alarm.name) {
        case AlarmTypes.UPDATE_NEWS:
            requestNews();
            break;
    }

}

function messageHandler(request, sender, sendResponse) {

    console.log(request.type, request.message);

    switch (request.type) {
        case SettingTypes.NUM_LAST_ITEMS:
        case MessageTypes.REQUEST_NEWS:
            requestNews();
            break;
        case SettingTypes.UPDATE_PERIOD:
            createAlarm();
            break;
        case SettingTypes.RSS_CHANNELS:
            break;
    }
}

function createAlarm() {

    console.log('delayInMinutes', parseInt(common.options.getUpdatePeriod()));
    browserAPI.createAlarm(AlarmTypes.UPDATE_NEWS, common.options.getUpdatePeriod());

}

function requestNews() {

    let news = newsGenerator.requestNews();

    browserAPI.displayBadge(news.length.toString());

    browserAPI.sendMessage(MessageTypes.UPDATE_NEWS, news);

}

initialize();
