import NewsData from "./news-data";
import SettingsStorage from "../settings/settings-storage";

var newsLoader = {

    /**
     * Sends an XHR GET request to grab last new from RSS feed of pravda.com.ua. The
     * XHR's 'onload' event is hooks up to the 'showNews_' method.
     *
     * @public
     */
    requestNews: function () {

        let settingsStorage = new SettingsStorage();

        // TODO XMLHttpRequest should be used async;
        // create request object
        var request = new XMLHttpRequest();
        // load from local storage rss-channels config
        var rss_channels_config = settingsStorage.getRSSChannels();
        // define result
        var res = [];

        console.log(settingsStorage.newsSources, rss_channels_config);

        // request news per rss channel
        Object.keys(settingsStorage.newsSources).forEach(function (key) {
            // retrieve data for enabled rss-channels or for all when no one selected
            if (rss_channels_config == null || rss_channels_config[key] === "true" || rss_channels_config[key] || Object.getOwnPropertyNames(rss_channels_config).length === 0) {
                try {
                    request.open("GET", settingsStorage.newsSources[key].rss, false);
                    request.send();
                    // check valid response
                    if (request.readyState == 4 && request.status == 200) {
                        // checking valid XML in response
                        if (request.responseXML != null || request.responseText != null) {
                            if (request.responseXML != null) {
                                var result = request.responseXML.querySelectorAll('item');
                            }
                            // fix for case when rss return result without XML content type
                            if (request.responseXML == null && request.responseText != null) {
                                var parser = new DOMParser();
                                var result = parser.parseFromString(request.responseText, "text/xml").querySelectorAll('item');
                            }
                            for (var i = 0; i < result.length && i < settingsStorage.getShowLastItems(); i++) {
                                // will show only unread news items
                                if (!settingsStorage.hasStoredNews(result[i].querySelector('link').textContent)) {

                                    let newsData = new NewsData();
                                    newsData.key = key;
                                    newsData.title = result[i].querySelector('title').textContent;
                                    newsData.date = result[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}')['input'];
                                    newsData.link = result[i].querySelector('link').textContent;

                                    res[res.length] = newsData;

                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log("Channel " + settingsStorage.newsSources[key].rss + " temporary unavailable.")
                }
            }
        });
        // sorting news by date through all channels
        res.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        return res;
    }
};

export default newsLoader;