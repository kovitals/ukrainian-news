/**
 * Created by valer on 04.08.2017.
 */
import NewsItem from "./news-item";

export default class NewsView {

    constructor(containerId) {
        this.content = document.getElementById(containerId);
        this.preloader = document.getElementById('p-preloader');
    }

    displayNews(news) {
        this.newsItemMap = new Map();

        let fragment = document.createDocumentFragment();

        for (var i = 0; i < news.length; i++) {
            /** @type NewsData **/
            let newsData = news[i];

            let newsItem = new NewsItem(newsData);
            newsItem.render(fragment);

            this.newsItemMap.set(newsData.link, newsItem);
        }

        this.content.appendChild(fragment);
    }

    removeNewsItem(url){
        console.log( this.newsItemMap.get(url) )
        // this.content.removeChild()
    }

    removeAllItems() {
        let child = this.content.firstChild;
        while (child) {
            this.content.removeChild(child);
            child = this.content.firstChild;
        }
    }

    showPreloader(){
        this.preloader.style.display = 'inline';
    }

    hidePreloader(){
        this.preloader.style.display = 'none';
    }
}