import BrowserAPI from "./browser/browser-api";
import SettingTypes from "./types/setting-types";
import AlarmTypes from "./types/alarm-types";
import MessageTypes from "./types/message-types";
import Utils from "./utils/utils";
import SettingsStorage from "./settings/settings-storage";
import NewsLoader from "./news/news-loader";

const postponeUpdateTime = 5;//sec
const newsUpdateTimer = 'news_update_timer';

const browserAPI = new BrowserAPI();
const settingsStorage = new SettingsStorage();
const newsLoader = new NewsLoader(settingsStorage);

function initialize() {
    settingsStorage.cleanupMarkedNews();

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
        case SettingTypes.NUM_LAST_NEWS:
        case MessageTypes.REQUEST_NEWS:
            requestNews();
            break;
        case SettingTypes.NEWS_UPDATE_PERIOD:
            createNewsUpdateAlarm();
            break;
        case SettingTypes.RSS_CHANNELS:
            Utils.createTimeOut(newsUpdateTimer, postponeUpdateTime, requestNews);
            break;
    }
}

function createNewsUpdateAlarm() {
    settingsStorage.getUpdatePeriod().then((value) => {
        browserAPI.createAlarm(AlarmTypes.UPDATE_NEWS, value, value);
    });
}

function requestNews() {
    Promise.all([settingsStorage.getRSSChannels(), settingsStorage.getNumLastNews()]).then((values) => {
        newsLoader.requestNews.apply(values).then(newsDataHandler);
    })
}

/**
 * @param {Array} data
 */
function newsDataHandler(data) {

    // for test;
    // settingsStorage.save('test_key_33', {news: 'some33', kera: 'two33'});
    // settingsStorage.load('test_key_33').then((value) => {
    //     console.log(value);
    // });

    console.log(data);

    let newsList = [];

    data.forEach((element) => {
        if (element && element.length > 0)
            newsList = newsList.concat(element);
    });

    newsList.sort((news1, news2) => {
        return new Date(news2.date) - new Date(news1.date);
    });

    // console.log(newsList);

    browserAPI.displayBadge(newsList.length.toString());
    browserAPI.sendMessage(MessageTypes.UPDATE_NEWS_COMPLETE, newsList);
}

initialize();