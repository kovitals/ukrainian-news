/**
 * Created by valer on 13.06.2017.
 */
export default class Messenger {
    // const MESSAGE_UPDATE_DELAY = 'update_delay';

    sendMessage(type, message) {
        // console.log('Messenger', type, message);
        chrome.runtime.sendMessage({type, message}, function (response) {
            // console.log(response);
        });
    }

}