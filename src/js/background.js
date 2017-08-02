import newsLoader from './news/news-loader';
import BrowserAPI from "./browser/browser-api";
import SettingTypes from "./types/setting-types";
import AlarmTypes from "./types/alarm-types";
import MessageTypes from "./types/message-types";
import Utils from "./utils/utils";
import SettingsStorage from "./settings/settings-storage";

const postponeUpdateTime = 5;//sec
const newsUpdateTimer = 'news_update_timer';

var browserAPI;
var settingsStorage;
var newsData;
var useMockData = true;

function initialize() {
    settingsStorage = new SettingsStorage();

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
            Utils.createTimeOut(newsUpdateTimer, postponeUpdateTime, requestNews);
            break;
    }
}

function createNewsUpdateAlarm() {
    let updateTime = settingsStorage.getUpdatePeriod();
    browserAPI.createAlarm(AlarmTypes.UPDATE_NEWS, updateTime, updateTime);
}

function requestNews() {
    newsData = (useMockData && newsData) ? newsData : newsLoader.requestNews();
    browserAPI.displayBadge(newsData.length.toString());
    browserAPI.sendMessage(MessageTypes.UPDATE_NEWS_COMPLETE, newsData);
}

initialize();
