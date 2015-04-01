var common = common || {};

common.options = {

    setWindowWidth : function(value) {
        this.set(common.storageKey.windowWidth, value);
    },

    getWindowWith : function() {
        return this.get(common.storageKey.windowWidth);
    },

    setRSSChannels : function(value) {
        this.set(common.storageKey.rssChannels, value);
    },

    getRSSChannels : function() {
        return this.get(common.storageKey.rssChannels);
    },

    setUpdatePeriod : function(value) {
        this.set(common.storageKey.updatePeriod, value);
    },

    getUpdatePeriod : function(){
        return this.get(common.storageKey.updatePeriod);
    },

    setShowLastItems : function (value) {
        this.set(common.storageKey.showLastItems, value);
    },

    getShowLastItems : function () {
        return this.get(common.storageKey.showLastItems);
    },

    isConfigured : function(key) {
        return localStorage.hasOwnProperty(key);
    },

    get : function(key) {
        if (localStorage.getItem(key)) {
            return localStorage.getItem(key);
        } else {
            if (this.isConfigured(key)) {
                return common.options.defaultValues.get(key);
            }
            return null;
        }
    },

    set : function(key,value) {
        if (key && value) {
            localStorage.setItem(key, value);
        }
    }
}

common.storageKey = {
    windowWidth: 'window_width_config',
    rssChannels: 'rss_channels_config',
    updatePeriod : 'background_period_config',
    showLastItems : 'show_last_items',
    readNews : 'ukrainian-news'
}

common.options.defaultValues = {
    windowWidth: 600,
    updatePeriod : 30,
    showLastItems : 5
}