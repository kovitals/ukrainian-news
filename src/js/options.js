import '../../vendor/materialize-src/js/bin/materialize';
import SourceItemView from './settings/source-item-view'
import SettingsStorage from "./settings/settings-storage";

const SLIDER_ID_NUM_NEWS = 'num-news';
const SLIDER_ID_UPDATE_DELAY = 'update-delay';
const SLIDER_ID_APP_WIDTH = 'app-width';

var sliderValuePostfixMap = {
    [SLIDER_ID_UPDATE_DELAY]: 'хвилин',
    [SLIDER_ID_APP_WIDTH]: 'пікселів'
};

/**
 * @type SettingsStorage
 */
var settingsStorage;
var sourceItems = [];

$(document).ready(function () {
    initialize();
});

function initialize() {
    settingsStorage = new SettingsStorage();
    settingsStorage.getRSSChannels().then(displayFeeds);
    initializeSliders();
}

/**
 * @param {Array} selectedChannels
 */
function displayFeeds(selectedChannels) {
    let channels = settingsStorage.getFeeds();
    let numRow = Math.ceil(Object.keys(channels).length / 2);
    let containers = [document.getElementById('collection-l'),
        document.getElementById('collection-r')];
    let index = 0;

    console.log(this, 'selectedChannels', selectedChannels);

    for (let key in channels) {
        let sourceItem = new SourceItemView(key, channels[key].name, channels[key].http, `img/${key}-icon.ico`);
        sourceItem.checked = selectedChannels.indexOf(key) != -1;
        sourceItem.displayTooltip('Відвідати сторінку');
        sourceItem.registerChangeHandler(checkboxChangeHandler);
        sourceItem.lastItem = ((index + 1) % numRow) == 0;
        sourceItem.render((index < numRow) ? containers[0] : containers[1]);

        sourceItems[index] = sourceItem;
        index++;
    }
}

function initializeSliders() {
    $('.tooltipped').tooltip({delay: 100});

    settingsStorage.getUpdatePeriod().then((value) => {
        initSlider(SLIDER_ID_UPDATE_DELAY, value);
    });

    settingsStorage.getWindowWidth().then((value) => {
        initSlider(SLIDER_ID_APP_WIDTH, value);
    });

    settingsStorage.getNumLastNews().then((value) => {
        initSlider(SLIDER_ID_NUM_NEWS, value);
    });
}

function checkboxChangeHandler(checkbox) {
    console.log(checkbox.id, checkbox.checked);

    let channels = [];
    sourceItems.forEach((sourceItem) => {
        if(sourceItem.checked)
            channels.push(sourceItem.key);
    });

    settingsStorage.setRSSChannels(channels);
}

function sliderChangeHandler(slider) {
    switch (slider.id) {
        case SLIDER_ID_NUM_NEWS:
            settingsStorage.setNumLastNews(slider.value);
            break;
        case SLIDER_ID_UPDATE_DELAY:
            settingsStorage.setUpdatePeriod(slider.value);
            break;
        case SLIDER_ID_APP_WIDTH:
            settingsStorage.setWindowWidth(slider.value);
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

function initSlider(id, defaultValue) {
    console.log(`default value for slider ${id} is ${defaultValue}`);

    let slider = document.getElementById(id);
    defaultValue = Math.min(defaultValue, slider.max);
    defaultValue = Math.max(defaultValue, slider.min);
    slider.value = defaultValue;
    slider.oninput = () => sliderInputHandler(slider);
    slider.onchange = () => sliderChangeHandler(slider);
    slider.oninput();
}