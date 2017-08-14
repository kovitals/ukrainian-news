/**
 * Created by valer on 30.07.2017.
 */
export default class NewsData {

    constructor() {
        this.key = '';
        this._title = '';
        this.date = '';
        this.link = '';
    }

    get title() {
        return this._title.trim();
    }

    set title(value) {
        this._title = value;
    }

}