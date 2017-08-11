import NewsData from "./news-data";

export default class NewsLoader {

    /**
     *
     * @param {SettingsStorage} settingsStorage
     */
    constructor(settingsStorage) {
        this.settingsStorage = settingsStorage;
    }

    requestNews(channels, numLastNews) {
        this.numLastNews = numLastNews;

        let sources = this.settingsStorage.getFeeds();
        let promises = [];

        for (let key in channels) {
            if (channels[key]) {
                let sourceData = sources[key];
                promises.push(this.load(key, sourceData.rss));
            }
        }

        return Promise.all(promises);
    }

    load(key, url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(this.parse(key, xhr.responseXML || xhr.response));
                } else {
                    console.log(xhr.statusText);
                    resolve(null);
                }
            };
            xhr.onerror = () => {
                resolve(null);
                console.log(xhr.statusText);
            };
            xhr.timeout = 5000;
            xhr.send();
        });
    }

    parse(key, xmlData) {
        // fix for case when rss return result without XML content type
        if (xmlData.contentType == undefined) {
            xmlData = new DOMParser().parseFromString(xmlData, "text/xml");
        }

        // console.log(key, xmlData);

        let result = xmlData.querySelectorAll('item');
        let length = Math.min(result.length, this.numLastNews);
        let newsList = [];

        for (var i = 0; i < length; i++) {

            let link = result[i].querySelector('link').textContent;

            // if (this.settingsStorage.hasStoredNews(link)) {
                // should be shown only unread news items;
                // continue;
            // }

            let newsData = new NewsData();
            newsData.key = key;
            newsData.title = result[i].querySelector('title').textContent;
            newsData.date = result[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}')['input'];
            newsData.link = link;

            newsList.push(newsData);
        }

        return newsList;
    }
}