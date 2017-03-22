var common = {};

// define news rss channels with an additional information
common.newsSources = {
    up : {
        "rss" : "http://www.pravda.com.ua/rss/view_news/",
        "http" : "http://www.pravda.com.ua",
        "name" : "Українська Правда"
    },
    lb : {
        "rss" : "https://lb.ua/rss/ukr/rss.xml",
        "http" : "https://lb.ua",
        "name" : "Лівий Берег"
    },
    lg : {
        "rss" : "http://news.liga.net/news/rss.xml",
        "http" : "http://news.liga.net",
        "name" : "Ліга Новини"
    },
    un : {
        "rss" : "http://rss.unian.net/site/news_rus.rss",
        "http" : "http://unian.net",
        "name" : "Агенція УНІАН"
    },
    cn : {
        "rss" : "http://censor.net.ua/includes/news_ru.xml",
        "http" : "http://censor.net.ua",
        "name" : "Цензор.НЕТ"
    },
    zn : {
        "rss" : "http://zn.ua/rss",
        "http" : "http://zn.ua",
        "name" : "Зеркало Недели"
    },
    fn : {
        "rss" : "http://news.finance.ua/rss",
        "http" : "http://finance.ua",
        "name" : "Finance.ua"
    },
    nv : {
        "rss" : "http://nv.ua/xml/rss.xml",
        "http" : "http://nv.ua",
        "name" : "Новое Время"
    },
    ix : {
        "rss" : "http://ua.interfax.com.ua/news/last.rss",
        "http" : "http://interfax.com.ua",
        "name" : "Інтерфакс"
    },
    tn : {
        "rss" : "https://tsn.ua/rss",
        "http" : "https://tsn.ua",
        "name" : "ТСН"
    },
    kr : {
        "rss" : "http://k.img.com.ua/rss/ru/all_news2.0.xml",
        "http" : "http://korrespondent.net",
        "name" : "Корреспондент"
    },
    gu : {
        "rss" : "https://gazeta.ua/rss",
        "http" : "https://gazeta.ua/",
        "name" : "Gazeta.ua"
    },
    ht : {
        "rss" : "http://112.ua/rss/index.rss",
        "http" : "http://112.ua",
        "name" : "112 Канал"
    },
    es : {
        "rss" : "http://espreso.tv/rss",
        "http" : "http://espreso.tv",
        "name" : "Еспресо"
    },
    gd : {
        "rss" : "http://gordonua.com/xml/rss.html",
        "http" : "http://gordonua.com",
        "name" : "Гордон"
    }
}

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