import common from './settings/settings-storage';
import '../../vendor/materialize-src/js/bin/materialize';
import SourceItemView from './settings/source-item-view'

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
    let selectedChannels = common.options.getRSSChannels();
    let channels = common.newsSources;
    let numRow = Math.ceil(Object.keys(channels).length / 2);
    let containers = [  document.getElementById('collection-l'),
                        document.getElementById('collection-r') ];
    let index = 0;

    for (let key in channels) {

        let sourceItem = new SourceItemView(key, channels[key].name, channels[key].http, `img/${key}-icon.ico`);
        sourceItem.checked = selectedChannels[key];
        sourceItem.displayTooltip('Відвідати сторінку');
        sourceItem.registerChangeHandler(checkboxChangeHandler);
        sourceItem.lastItem = ((index + 1) % numRow) == 0;
        sourceItem.render( (index < numRow) ?  containers[0] : containers[1] );

        index++;
    }

    $('.tooltipped').tooltip({delay: 100});

    initializeSlider(SLIDER_ID_NUM_NEWS, common.options.getShowLastItems());
    initializeSlider(SLIDER_ID_UPDATE_DELAY, common.options.getUpdatePeriod());
    initializeSlider(SLIDER_ID_APP_WIDTH, common.options.getWindowWidth());
}

function checkboxChangeHandler(checkbox) {
    console.log(checkbox.id, checkbox.checked);

    if (checkbox.checked)
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