import common from './settings/common';
import newsGenerator from './news/news-loader';
import BrowserAPI from "./browser/browser-api";
import SettingTypes from "./types/setting-types";
import AlarmTypes from "./types/alarm-types";
import MessageTypes from "./types/message-types";
import {Utils} from "./utils/utils";

var browserAPI;

const postponeUpdateTime = 0.05;

function initialize() {
    browserAPI = new BrowserAPI();
    browserAPI.listenAlarm(alarmHandler);
    browserAPI.listenMessage(messageHandler);

    createNewsUpdateAlarm();

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
    console.log('messageHandler(', request.type, request.message, ')');

    switch (request.type) {
        case SettingTypes.NUM_LAST_ITEMS:
        case MessageTypes.REQUEST_NEWS:
            requestNews();
            break;
        case SettingTypes.UPDATE_PERIOD:
            createNewsUpdateAlarm();
            break;
        case SettingTypes.RSS_CHANNELS:
            // Utils.createTimeOut(AlarmTypes.POSTPONE_UPDATE, postponeUpdateHandler, postponeUpdateTime);
            break;
    }
}

function postponeUpdateHandler() {
    console.log('postponeUpdateHandler');
}

function createNewsUpdateAlarm() {
    let updateTime = common.options.getUpdatePeriod();
    browserAPI.createAlarm(AlarmTypes.UPDATE_NEWS, updateTime, updateTime);
}

function requestNews() {
    let news = newsGenerator.requestNews();
    browserAPI.displayBadge(news.length.toString());
    browserAPI.sendMessage(MessageTypes.UPDATE_NEWS_COMPLETE, news);
}

initialize();
