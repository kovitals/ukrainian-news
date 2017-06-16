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
    let selectedChannels = common.options.getRSSChannels();
    let channels = common.newsSources;
    let collection = document.getElementById('collection');

    for (let key in channels) {
        let channel = channels[key];
        // console.log(key,selectedChannels[key]);
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