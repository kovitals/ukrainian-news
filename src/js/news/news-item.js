export default class NewsItem{

    /** @type NewsData **/
    constructor(newsData) {
        // console.log(newsData.title);

        let a = document.createElement('a');
        a.setAttribute('href', newsData.link);
        a.setAttribute('target', '_blank');
        a.innerText = newsData.title.trim();

        this.p = document.createElement('p');
        this.p.className = 'p-item-title';
        this.p.appendChild(a);

    }

    get element(){
        return this.p;
    }

    render(container){
        container.appendChild(this.p);
    }
}