import channels from '../channels.json';

var common = {};

var rssChannels;

// define news rss channels with an additional information
common.newsSources = channels;

common.options = {

    /**
     * Load from local storage have read news items
     *
     * @returns {*}
     */
    getStoredNews: function () {
        if (localStorage.getItem(common.storageKey.readNews)) {
            return JSON.parse(localStorage.getItem(common.storageKey.readNews));
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
            localStorage.setItem(common.storageKey.readNews, JSON.stringify(new Array(newsItem)));
        } else {
            let arr = this.getStoredNews();
            arr.push(newsItem);
            localStorage.setItem(common.storageKey.readNews, JSON.stringify(arr));
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
        this.set(common.storageKey.windowWidth, value);
    },

    getWindowWidth: function () {
        return this.get(common.storageKey.windowWidth);
    },

    removeRSSChannel: function (id) {
        rssChannels[id] = false;
        console.log('removeRSSChannel', id, rssChannels);
        this.set(common.storageKey.rssChannels, JSON.stringify(rssChannels));
    },

    addRSSChannel: function (id) {
        rssChannels[id] = true;
        console.log('addRSSChannel', id, rssChannels);
        this.set(common.storageKey.rssChannels, JSON.stringify(rssChannels));
    },

    getRSSChannels: function () {
        let channels = this.get(common.storageKey.rssChannels);

        if (rssChannels == undefined)
            rssChannels = JSON.parse(channels);

        return rssChannels;
    },

    setUpdatePeriod: function (value) {
        this.set(common.storageKey.updatePeriod, value);
    },

    getUpdatePeriod: function () {
        return parseInt(this.get(common.storageKey.updatePeriod));
    },

    setShowLastItems: function (value) {
        this.set(common.storageKey.showLastItems, value);
    },

    getShowLastItems: function () {
        return this.get(common.storageKey.showLastItems);
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
        }
    }
}

common.storageKey = {
    windowWidth: 'window_width_config',
    rssChannels: 'rss_channels_config',
    updatePeriod: 'background_period_config',
    showLastItems: 'show_last_items',
    readNews: 'ukrainian-news'
}

common.options.defaultValues = {
    window_width_config: 650,
    background_period_config: 30,
    show_last_items: 8
}

export default common;