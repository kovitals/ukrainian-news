/**
 * Created by valer on 30.07.2017.
 */
export default class Utils {

    static createTimeOut(name, delayInSeconds, callback) {
        if (!Utils._timerIdMap)
            Utils._timerIdMap = {};

        Utils.clearTimeOut(name);

        Utils._timerIdMap[name] = setTimeout(callback, delayInSeconds * 1000);
    }

    static clearTimeOut(name) {
        if (Utils._timerIdMap[name] != undefined) {
            clearTimeout(Utils._timerIdMap[name]);
        }
    }
}