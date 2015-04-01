// Saves selected rss chanel to local storage
function save_options() {
    var rss_channels_config = {};
    var rss_channels = document.getElementsByTagName('input');
    for (var i = 0; i < rss_channels.length; i++) {
        if (rss_channels[i].checked == true) {
            rss_channels_config[rss_channels[i].getAttribute('name').toString()] = rss_channels[i].checked.toString();
        }
    }
    common.options.setRSSChannels(JSON.stringify(rss_channels_config));
    if (document.getElementById(common.storageKey.updatePeriod).value) {
        common.options.setUpdatePeriod(document.getElementById(common.storageKey.updatePeriod).value);
        chrome.alarms.clear('ukrainian-news');
        chrome.alarms.create('ukrainian-news', {
            delayInMinutes: 0,
            periodInMinutes: parseInt(document.getElementById(common.storageKey.updatePeriod).value)
        });
    }
    common.options.setWindowWidth(document.getElementById(common.storageKey.windowWidth).value);
    common.options.setShowLastItems(document.getElementById(common.storageKey.showLastItems).value);
    alert("Налаштування збережені");
}
// Restores selected rss channels from local storage
function restore_options() {
    if (common.options.getRSSChannels()) {
        var rss_channels_config = JSON.parse(common.options.getRSSChannels());
        Object.keys(rss_channels_config).forEach(function (key) {
            document.getElementById(key).checked = (rss_channels_config[key] === "true");
        });
    }
    document.getElementById(common.storageKey.showLastItems).value = common.options.getShowLastItems();
    document.getElementById(common.storageKey.updatePeriod).value = common.options.getUpdatePeriod();
    document.getElementById(common.storageKey.windowWidth).value = common.options.getWindowWith();
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);