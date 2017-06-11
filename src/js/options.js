import common from './common';
import '../../vendor/materialize-src/js/bin/materialize';

const SLIDER_ID_NUM_NEWS = 'num-news';
const SLIDER_ID_UPDATE_DELAY = 'update-delay';
const SLIDER_ID_APP_WIDTH = 'app-width';

let sliderValuePostfixMap = {
    [SLIDER_ID_UPDATE_DELAY]: 'хвилин',
    [SLIDER_ID_APP_WIDTH]: 'пікселів'
};

$(document).ready(function () {
    initialize();
});

function initialize() {
    console.log(this, 'initialize;');

    let selectedChannels = common.options.getRSSChannels();
    let channels = common.newsSources;
    let collection = document.getElementById('collection');

    for (let key in channels) {
        let channel = channels[key];
        console.log(key,selectedChannels[key]);
        let checked = selectedChannels[key] ? 'checked' : '';
        let p = document.createElement('p');
        p.className = "col s6 s-channel";
        p.innerHTML = `<input type="checkbox" id="${key}" ${checked}/>
                        <label for="${key}">
                        <img src="img/${key}-icon.ico" class="s-icon"><a href="${channel.http}" target="_blank" class="s-link">${channel.name}
                        </label>`;//class="circle"
        collection.appendChild(p);

        let checkbox = document.getElementById(key);
        checkbox.onchange = () => checkboxChangeHandler(checkbox);
    }

    initializeSlider(SLIDER_ID_NUM_NEWS, common.options.getShowLastItems());
    initializeSlider(SLIDER_ID_UPDATE_DELAY, common.options.getUpdatePeriod());
    initializeSlider(SLIDER_ID_APP_WIDTH, common.options.getWindowWidth());
}

function checkboxChangeHandler(checkbox) {
    console.log(checkbox.id, checkbox.checked);

    if(checkbox.checked)
        common.options.addRSSChannel(checkbox.id);
    else
        common.options.removeRSSChannel(checkbox.id);
}

function sliderChangeHandler(slider) {
    switch (slider.id) {
        case SLIDER_ID_NUM_NEWS:
            common.options.setShowLastItems(slider.value);
            break;
        case SLIDER_ID_UPDATE_DELAY:
            common.options.setUpdatePeriod(slider.value);
            break;
        case SLIDER_ID_APP_WIDTH:
            common.options.setWindowWidth(slider.value);
            break;
    }
    console.log(slider.id, slider.value);
}

function sliderInputHandler(slider) {
    let postfixText = sliderValuePostfixMap[slider.id];

    if (postfixText == undefined)
        postfixText = '';

    let valueField = document.getElementById(slider.id + '-value');
    valueField.innerText = slider.value + ' ' + postfixText;
}

function initializeSlider(id, defaultValue) {
    console.log(`default value for slider ${id} is ${defaultValue}`);

    let slider = document.getElementById(id);
    defaultValue = Math.min(defaultValue, slider.max);
    defaultValue = Math.max(defaultValue, slider.min);
    slider.value = defaultValue;
    slider.oninput = () => sliderInputHandler(slider);
    slider.onchange = () => sliderChangeHandler(slider);
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