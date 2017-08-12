import channels from '../../channels.json';
import BrowserAPI from '../browser/browser-api';
import SettingTypes from "../types/setting-types";

export default class SettingsStorage {

    constructor() {
        this.defaultValues = {
            [SettingTypes.WINDOW_WIDTH]: 500,
            [SettingTypes.NEWS_UPDATE_PERIOD]: 30,
            [SettingTypes.NUM_LAST_NEWS]: 8,
            [SettingTypes.RSS_CHANNELS]: Object.keys(this.getFeeds()),
            [SettingTypes.MARKED_NEWS]: [],
            [SettingTypes.FAVORITE_NEWS]: []
        };

        console.log(this.defaultValues[SettingTypes.RSS_CHANNELS]);

        this.browserAPI = new BrowserAPI();
    }

    /**
     * @param {String} key
     * @param {Object} value
     */
    save(key, value) {
        this.browserAPI.storageSet(key, value);
        this.browserAPI.sendMessage(key, value);
    }

    /**
     * @param {String} key
     * return {Promise}
     */
    load(key) {
        let p = new Promise((resolve, reject) => {
            this.browserAPI.storageGet(key).then((value) => {
                console.log('load', key, value, this.defaultValues[key]);
                if (value == undefined) {
                    resolve(this.defaultValues[key]);
                }
                else {
                    resolve(value);
                }
            })
        });

        return p;
    }

    /**
     * @param {Number} value
     */
    setUpdatePeriod(value) {
        this.save(SettingTypes.NEWS_UPDATE_PERIOD, value);
    }

    /**
     * @returns {Promise}
     */
    getUpdatePeriod() {
        return this.load(SettingTypes.NEWS_UPDATE_PERIOD);
    }

    /**
     * @param {Number} value
     */
    setWindowWidth(value) {
        this.save(SettingTypes.WINDOW_WIDTH, value);
    }

    /**
     * @returns {Promise}
     */
    getWindowWidth() {
        return this.load(SettingTypes.WINDOW_WIDTH);
    }

    /**
     * @param {Number} value
     */
    setNumLastNews(value) {
        this.save(SettingTypes.NUM_LAST_NEWS, value);
    }

    /**
     * @returns {Promise}
     */
    getNumLastNews() {
        return this.load(SettingTypes.NUM_LAST_NEWS);
    }

    /**
     * return all available rss feeds;
     * @return {Object}
     */
    getFeeds() {
        return channels;
    }

    /**
     * @return {Promise}
     */
    getRSSChannels() {
        return this.load(SettingTypes.RSS_CHANNELS);
    }

    /**
     * @param {Array} value
     */
    setRSSChannels(value) {
        console.log('setRSSChannels', value);
        this.save(SettingTypes.RSS_CHANNELS, value);
    }

    cleanupMarkedNews() {
        this.getMarkedNews().then((newsList) => {
            console.log('cleanupMarkedNews', newsList);
            newsList = newsList.filter((news) => {
                console.log('cleanupMarkedNews', new Date() - news.date, news.url);
                return true;
            });
            this.save(SettingTypes.MARKED_NEWS, newsList);
        });
    }

    addMarkedNews(url, date) {
        let news = {date, url};
        this.getMarkedNews().then((markedNews) => {
            markedNews.push(news);
            this.save(SettingTypes.MARKED_NEWS, markedNews);
        });
    }

    /**
     * @return {Promise}
     */
    getMarkedNews() {
        return this.load(SettingTypes.MARKED_NEWS);
    }

    /**
     * @param {NewsData} newsData
     */
    addFavoriteNews(newsData) {
        this.getFavoriteNews().then((favoriteNews) => {
            favoriteNews.push(newsData);
            this.save(SettingTypes.FAVORITE_NEWS, favoriteNews);
        });
    }

    /**
     * @return {Promise}
     */
    getFavoriteNews() {
        return this.load(SettingTypes.FAVORITE_NEWS);
    }
}