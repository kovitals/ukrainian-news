// Saves selected rss chanel to local storage
function save_options() {

    var rss_channels_config = {};

    var rss_channels = document.getElementsByTagName('input');

    for (var i = 0; i < rss_channels.length; i++) {
        if (rss_channels[i].checked == true) {
            rss_channels_config[rss_channels[i].getAttribute('name').toString()] = rss_channels[i].checked.toString();
        }
    }

    localStorage.setItem('rss_channels_config', JSON.stringify(rss_channels_config));

    if (document.getElementById('background_period_config').value) {
        localStorage.setItem('background_period_config', document.getElementById('background_period_config').value);

        chrome.alarms.clear('ukrainian-news');
        chrome.alarms.create('ukrainian-news', {
            delayInMinutes: 0,
            periodInMinutes: parseInt(document.getElementById('background_period_config').value)
        });
    }

    if (document.getElementById('window_width_config').value) {
        localStorage.setItem('window_width_config', document.getElementById('window_width_config').value);
    }

    alert("Налаштування збережені");
}

// Restores selected rss channels from local storage
function restore_options() {
    if (localStorage.getItem('rss_channels_config')) {
        var rss_channels_config = JSON.parse(localStorage.getItem('rss_channels_config'));
        Object.keys(rss_channels_config).forEach(function (key) {
            document.getElementById(key).checked = (rss_channels_config[key] === "true");
        });
    }
    if (localStorage.getItem('background_period_config')) {
        document.getElementById('background_period_config').value = localStorage.getItem('background_period_config');
    } else {
        // default value - 30 minutes
        document.getElementById('background_period_config').value = 30;
    }
    if (localStorage.getItem('window_width_config')) {
        document.getElementById('window_width_config').value = localStorage.getItem('window_width_config');
    } else {
        // default window width value - 600px
        document.getElementById('window_width_config').value = 600;
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);