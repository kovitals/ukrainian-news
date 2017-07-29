import channels from '../../channels.json';
import BrowserAPI from '../browser/browser-api';
import SettingTypes from "../types/setting-types";

var common = {};
var rssChannels;

let browserAPI = new BrowserAPI();

// define news rss channels with an additional information
common.newsSources = channels;

common.options = {

    /**
     * Load from local storage have read news items
     *
     * @returns {*}
     */
    getStoredNews: function () {
        if (localStorage.getItem(SettingTypes.STORED_NEWS)) {
            return JSON.parse(localStorage.getItem(SettingTypes.STORED_NEWS));
        }
        return false;
    },

    /**
     * Save one news item to local storage as have read
     *
     * @param newsItem
     */
    addStoredNews: function (newsItem) {
        if (this.getStoredNews() == false) {
            localStorage.setItem(SettingTypes.STORED_NEWS, JSON.stringify(new Array(newsItem)));
        } else {
            let arr = this.getStoredNews();
            arr.push(newsItem);
            localStorage.setItem(SettingTypes.STORED_NEWS, JSON.stringify(arr));
        }
    },

    /**
     * Check if provided news item have already read and exist in local storage
     *
     * @param newsitem
     */
    hasStoredNews: function (newsitem) {
        let news = this.getStoredNews();

        if (news) {
            return (news.indexOf(newsitem) > -1);
        }

        return false;
    },

    setWindowWidth: function (value) {
        this.set(SettingTypes.WINDOW_WIDTH, value);
    },

    getWindowWidth: function () {
        return this.get(SettingTypes.WINDOW_WIDTH);
    },

    removeRSSChannel: function (id) {
        rssChannels[id] = false;
        console.log('removeRSSChannel', id, rssChannels);
        this.set(SettingTypes.RSS_CHANNELS, JSON.stringify(rssChannels));
    },

    addRSSChannel: function (id) {
        rssChannels[id] = true;
        console.log('addRSSChannel', id, rssChannels);
        this.set(SettingTypes.RSS_CHANNELS, JSON.stringify(rssChannels));
    },

    getRSSChannels: function () {
        let channels = this.get(SettingTypes.RSS_CHANNELS);

        if(!channels)
        {
            rssChannels = {};

            Object.keys(common.newsSources).forEach(
                function (key) {
                    rssChannels[key] = true;
                }
            );
        }

        if (rssChannels == undefined)
            rssChannels = JSON.parse(channels);

        return rssChannels;
    },

    setUpdatePeriod: function (value) {
        this.set(SettingTypes.UPDATE_PERIOD, value);
    },

    getUpdatePeriod: function () {
        return parseInt(this.get(SettingTypes.UPDATE_PERIOD));
    },

    setShowLastItems: function (value) {
        this.set(SettingTypes.NUM_LAST_ITEMS, value);
    },

    getShowLastItems: function () {
        return this.get(SettingTypes.NUM_LAST_ITEMS);
    },

    get: function (key) {
        if (localStorage.getItem(key)) {
            return localStorage.getItem(key);
        } else {
            if (common.options.defaultValues.hasOwnProperty(key)) {
                return common.options.defaultValues[key];
            }
            return null;
        }
    },

    set: function (key, value) {
        if (key && value) {
            localStorage.setItem(key, value);
            browserAPI.sendMessage(key, value);
        }
    }
}

common.options.defaultValues = {
    window_width_config: 650,
    background_period_config: 30,
    show_last_items: 8
}

export default common;