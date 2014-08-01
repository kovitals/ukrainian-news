// Saves options to Local.storage
function save_options() {

    var rss_channels_storage = {};

    if (localStorage.getItem('rss_channels_storage')) {
        var rss_channels_storage = JSON.parse(localStorage.getItem('rss_channels_storage'));
    }

    var rss_channels_options = document.getElementsByTagName('input');

    for (i = 0; i < rss_channels_options.length; i++) {
        rss_channels_storage[rss_channels_options[i].getAttribute('name').toString()] = rss_channels_options[i].checked.toString();
    }

    localStorage.setItem('rss_channels_storage', JSON.stringify(rss_channels_storage));
}

// Restores select box and checkbox state using the preferences
// stored in Local.storage.
function restore_options() {
    if (localStorage.getItem('rss_channels_storage')) {
        var rss_channels_storage = JSON.parse(localStorage.getItem('rss_channels_storage'));
        Object.keys(rss_channels_storage).forEach(function (key) {
            document.getElementById(key).checked = (rss_channels_storage[key] === "true");
        });
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);