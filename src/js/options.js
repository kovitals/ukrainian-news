import common from './common';
import '../../vendor/materialize-src/js/bin/materialize';

$(document).ready(function () {
    initialize();
});

function initialize() {

    let selectedChannels = JSON.parse(common.options.getRSSChannels());
    let channels = common.newsSources;
    let collection = document.getElementById('collection');

    for (let key in channels) {
        let channel = channels[key];
        let checked = (selectedChannels[key] != undefined) ? 'checked' : '';
        let p = document.createElement('p');
        p.className = "col s6 s-channel";
        p.innerHTML = `<input type="checkbox" id="${key}" ${checked}/>
                        <label for="${key}">
                        <img src="img/${key}-icon.ico" class="s-icon"><a href="${channel.http}" target="_blank" class="s-link">${channel.name}
                        </label>`;//class="circle"

        collection.appendChild(p);
    }

    initializeSlider('num-news', 2, 'num-news-value', '');
    initializeSlider('update-delay', 30, 'update-delay-value', 'хвилин');
    initializeSlider('app-width', 600, 'app-width-value', 'пікселів');

}

function initializeSlider(sliderId, defaultValue, valueElementId, postfixText) {
    let field =  document.getElementById(valueElementId);
    let slider = document.getElementById(sliderId);
    slider.value = defaultValue;
    slider.oninput = function () {
        field.innerText = this.value + ' ' + postfixText;
    }
    slider.oninput();
}

// Saves selected rss chanel to local storage
/*
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
 delayInMinutes: parseInt(common.options.getUpdatePeriod()),
 periodInMinutes: parseInt(common.options.getUpdatePeriod())
 });
 }

 common.options.setWindowWidth(document.getElementById(common.storageKey.windowWidth).value);
 common.options.setShowLastItems(document.getElementById(common.storageKey.showLastItems).value);
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
 document.getElementById(common.storageKey.windowWidth).value = common.options.getWindowWidth();
 }

 document.addEventListener('DOMContentLoaded', restore_options);
 document.getElementById('save').addEventListener('click', save_options);

 // create elements for each news source
 Object.keys(common.newsSources).forEach(function (key) {
 var newsSourceItem = document.createElement('li');
 newsSourceItem.setAttribute("class", "newsSourcesElement");

 var newsSourceCheckbox = document.createElement('input');
 newsSourceCheckbox.setAttribute("type", "checkbox");
 newsSourceCheckbox.setAttribute("name", key);
 newsSourceCheckbox.setAttribute("id", key);

 var newsSourceIcon = document.createElement('img');
 newsSourceIcon.setAttribute("src", "img/" + key + "-icon.ico");

 var newsSourceLink = document.createElement('a');
 newsSourceLink.setAttribute("href", common.newsSources[key].http)
 newsSourceLink.setAttribute("target", "_blank");
 newsSourceLink.innerText = common.newsSources[key].name;

 newsSourceItem.appendChild(newsSourceCheckbox);
 newsSourceItem.appendChild(newsSourceIcon);
 newsSourceItem.appendChild(newsSourceLink);

 document.getElementsByClassName("newsSources")[0].appendChild(newsSourceItem);
 });
 */