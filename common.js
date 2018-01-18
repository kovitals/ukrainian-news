var common = {};

// define news rss channels with an additional information
common.newsSources = {
    up: {
        "rss": "https://www.pravda.com.ua/rss/view_news/",
        "http": "https://www.pravda.com.ua",
        "name": "Українська Правда"
    },
    lb: {
        "rss": "https://lb.ua/rss/ukr/rss.xml",
        "http": "https://lb.ua",
        "name": "Лівий Берег"
    },
    lg: {
        "rss": "http://news.liga.net/news/rss.xml",
        "http": "http://news.liga.net",
        "name": "Ліга Новини"
    },
    un: {
        "rss": "http://rss.unian.net/site/news_ukr.rss",
        "http": "http://unian.net",
        "name": "Агенція УНІАН"
    },
    cn: {
        "rss": "https://ua.censor.net.ua/includes/news_uk.xml",
        "http": "https://censor.net.ua",
        "name": "Цензор.НЕТ"
    },
    zn: {
        "rss": "https://dt.ua/rss",
        "http": "https://dt.ua",
        "name": "Дзеркало Тижня"
    },
    fn: {
        "rss": "https://news.finance.ua/ua/rss",
        "http": "https://finance.ua",
        "name": "Finance.ua"
    },
    nv: {
        "rss": "https://nv.ua/ukr/xml/rss.html",
        "http": "https://nv.ua",
        "name": "Новий Час"
    },
    ix: {
        "rss": "http://ua.interfax.com.ua/news/last.rss",
        "http": "http://interfax.com.ua",
        "name": "Інтерфакс"
    },
    tn: {
        "rss": "https://tsn.ua/rss",
        "http": "https://tsn.ua",
        "name": "ТСН"
    },
    kr: {
        "rss": "http://k.img.com.ua/rss/ua/all_news2.0.xml",
        "http": "http://korrespondent.net",
        "name": "Korrespondent.net"
    },
    gu: {
        "rss": "https://gazeta.ua/rss",
        "http": "https://gazeta.ua/",
        "name": "Gazeta.ua"
    },
    ht: {
        "rss": "https://ua.112.ua/rss/index.rss",
        "http": "https://112.ua",
        "name": "112 Канал"
    },
    es: {
        "rss": "https://espreso.tv/rss",
        "http": "https://espreso.tv",
        "name": "Еспресо"
    },
    gd: {
        "rss": "https://gordonua.com/xml/rss.html",
        "http": "https://gordonua.com",
        "name": "Гордон"
    }
}

common.options = {

    setWindowWidth: function (value) {
        this.set(common.storageKey.windowWidth, value);
    },

    getWindowWidth: function () {
        return this.get(common.storageKey.windowWidth);
    },

    setRSSChannels: function (value) {
        this.set(common.storageKey.rssChannels, value);
    },

    getRSSChannels: function () {
        return this.get(common.storageKey.rssChannels);
    },

    setUpdatePeriod: function (value) {
        this.set(common.storageKey.updatePeriod, value);
    },

    getUpdatePeriod: function () {
        return this.get(common.storageKey.updatePeriod);
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