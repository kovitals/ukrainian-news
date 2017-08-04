/**
 * Created by valer on 04.08.2017.
 */
import NewsItem from "./news-item";

export default class NewsView {

    constructor(containerId) {
        this.content = document.getElementById(containerId);
    }

    displayNews(news) {

        this.newsItemList = [];

        let fragment = document.createDocumentFragment();

        for (var i = 0; i < news.length; i++) {
            let newsItem = new NewsItem(news[i]);
            newsItem.render(fragment);

            this.newsItemList[i] = newsItem;
        }

        this.content.appendChild(fragment);
    }

    removeNews(){

    }

    removeAll() {
        let child = this.content.firstChild;
        while (child) {
            this.content.removeChild(child);
            child = this.content.firstChild;
        }
    }
}