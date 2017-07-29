/**
 * Created by valer on 30.07.2017.
 */

let _timerMap = new WeakMap();

export default class Utils{

    static createTimeOut(name, callback, delayInSeconds){

        if(_timerMap.has(name))
        {
            clearTimeout(_timerMap.get(name));
        }

        let timer = setTimeout(callback, delayInSeconds * 1000);
        _timerMap.set(name, timer);

    }

}