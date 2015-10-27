var common = {};

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

    get : function(key) {
        if (localStorage.getItem(key)) {
            return localStorage.getItem(key);
        } else {
            if (common.options.defaultValues.hasOwnProperty(key)) {
                return common.options.defaultValues[key];
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
    window_width_config : 650,
    background_period_config : 30,
    show_last_items : 8
}

common.newsSources = {
    up : "http://www.pravda.com.ua/rss/view_news/",
    lb : "http://lb.ua/export/rss.xml",
    lg : "http://news.liga.net/news/rss.xml",
    un : "http://rss.unian.net/site/news_rus.rss",
    cn : "http://censor.net.ua/includes/news_ru.xml",
    zn : "http://zn.ua/rss",
    fn : "http://news.finance.ua/rss",
    nv : "http://nv.ua/xml/rss.xml",
    ix : "http://ua.interfax.com.ua/news/last.rss",
    tn : "http://tsn.ua/rss",
    kr : "http://k.img.com.ua/rss/ru/all_news2.0.xml",
    gu : "http://gazeta.ua/rss",
    ht : "http://112.ua/rss/index.rss",
    es : "http://espreso.tv/rss",
    gd : "http://gordonua.com/xml/rss.html",
    hm : "http://www.hromadske.tv/misc/spec/all-chapters.xml",
}