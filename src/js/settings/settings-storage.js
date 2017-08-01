import channels from '../../channels.json';
import BrowserAPI from '../browser/browser-api';
import SettingTypes from "../types/setting-types";

export default class SettingsStorage {

    constructor() {
        this.browserAPI = new BrowserAPI();
    }

    // define news rss channels with an additional information
    get newsSources() {
        return channels;
    }

    get defaultValues() {
        return {
            window_width_config: 650,
            background_period_config: 30,
            show_last_items: 8
        }
    }

    /**
     * Load from local storage have read news items
     *
     * @returns {*}
     */
    getStoredNews() {
        if (localStorage.getItem(SettingTypes.STORED_NEWS)) {
            return JSON.parse(localStorage.getItem(SettingTypes.STORED_NEWS));
        }
        return false;
    }

    /**
     * Save one news item to local storage as have read
     *
     * @param newsItem
     */
    addStoredNews(newsItem) {
        if (this.getStoredNews() == false) {
            localStorage.setItem(SettingTypes.STORED_NEWS, JSON.stringify(new Array(newsItem)));
        } else {
            let arr = this.getStoredNews();
            arr.push(newsItem);
            localStorage.setItem(SettingTypes.STORED_NEWS, JSON.stringify(arr));
        }
    }

    /**
     * Check if provided news item have already read and exist in local storage
     *
     * @param newsitem
     */
    hasStoredNews(newsitem) {
        let news = this.getStoredNews();

        if (news) {
            return (news.indexOf(newsitem) > -1);
        }

        return false;
    }

    setWindowWidth(value) {
        this.set(SettingTypes.WINDOW_WIDTH, value);
    }

    getWindowWidth() {
        return this.get(SettingTypes.WINDOW_WIDTH);
    }

    removeRSSChannel(id) {
        this.rssChannels[id] = false;
        console.log('removeRSSChannel', id, this.rssChannels);
        this.set(SettingTypes.RSS_CHANNELS, JSON.stringify(this.rssChannels));
    }

    addRSSChannel(id) {
        this.rssChannels[id] = true;
        console.log('addRSSChannel', id, this.rssChannels);
        this.set(SettingTypes.RSS_CHANNELS, JSON.stringify(this.rssChannels));
    }

    getRSSChannels() {
        let channels = this.get(SettingTypes.RSS_CHANNELS);

        if (!channels) {
            this.rssChannels = {};

            Object.keys(this.newsSources).forEach(
                function (key) {
                    this.rssChannels[key] = true;
                }
            );
        }

        if (this.rssChannels == undefined)
            this.rssChannels = JSON.parse(channels);

        return this.rssChannels;
    }

    setUpdatePeriod(value) {
        this.set(SettingTypes.UPDATE_PERIOD, value);
    }

    getUpdatePeriod() {
        return parseInt(this.get(SettingTypes.UPDATE_PERIOD));
    }

    setShowLastItems(value) {
        this.set(SettingTypes.NUM_LAST_ITEMS, value);
    }

    getShowLastItems() {
        return this.get(SettingTypes.NUM_LAST_ITEMS);
    }

    get(key) {
        if (localStorage.getItem(key)) {
            return localStorage.getItem(key);
        } else {
            if (this.defaultValues.hasOwnProperty(key)) {
                return this.defaultValues[key];
            }
            return null;
        }
    }

    set(key, value) {
        if (key && value) {
            localStorage.setItem(key, value);
            this.browserAPI.sendMessage(key, value);
        }
    }
}