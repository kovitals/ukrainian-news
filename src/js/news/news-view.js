/**
 * Created by valer on 04.08.2017.
 */
import List from "list.js";

export default class NewsView {

    constructor(containerId) {
        this.options = {
            valueNames: ['title', {name: 'link', attr: 'href'}],
            item: '<li><a href="#" target="_blank" class="p-item-title title link"></a></li>'
        };

        this.preloader = document.getElementById('p-preloader');

        /**
         * @type List
         */
        this.list = new List(containerId, this.options);
    }

    /**
     * @param {String} valueName
     * @param {String} order
     */
    sort(valueName, order){
        this.list.sort(valueName, {order});
    }

    /**
     * @param {String} text
     */
    search(text){
        this.list.search(text);
    }

    /**
     * @param {Array} news
     */
    displayNews(news) {
        console.log(news, news.length, news[news.length - 1].title);
        this.list.add(news);
    }

    removeAllItems() {
        this.list.clear();
    }

    removeNewsItem(url) {
        // console.log(this.newsItemMap.get(url))
        // this.content.removeChild()
    }

    showPreloader() {
        this.preloader.style.display = 'inline';
    }

    hidePreloader() {
        this.preloader.style.display = 'none';
    }
}