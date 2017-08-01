import common from './common';

var newsGenerator = {

    /**
     * Sends an XHR GET request to grab last new from RSS feed of pravda.com.ua. The
     * XHR's 'onload' event is hooks up to the 'showNews_' method.
     *
     * @public
     */
    requestNews: function () {

        // TODO XMLHttpRequest should be used async;

        // create request object
        var request = new XMLHttpRequest();
        // load from local storage rss-channels config
        var rss_channels_config = JSON.parse(common.options.getRSSChannels());
        // define result
        var res = [];


        // request news per rss channel
        Object.keys(common.newsSources).forEach(function (key) {
            // retrieve data for enabled rss-channels or for all when no one selected
            if (rss_channels_config == null || rss_channels_config[key] === "true" || Object.getOwnPropertyNames(rss_channels_config).length === 0) {
                try {
                    request.open("GET", common.newsSources[key].rss, false);
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
                            for (var i = 0; i < result.length && i < common.options.getShowLastItems(); i++) {
                                // will show only unread news items
                                if (!common.options.hasStoredNews(result[i].querySelector('link').textContent)) {
                                    var rst = [];
                                    rst['key'] = key;
                                    rst['date'] = result[i].querySelector('pubDate').textContent.match('[0-9]{2}:[0-9]{2}')['input'];
                                    rst['title'] = result[i].querySelector('title').textContent;
                                    rst['link'] = result[i].querySelector('link').textContent;
                                    res[res.length] = rst;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log("Channel " + common.newsSources[key].rss + " temporary unavailable.")
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

export default newsGenerator;