/**
 * Created by valeriyb on 6/27/2017.
 */
export default class SourceItemView {

    constructor(key, name, url, imageUrl) {

        this.key = key;
        this.name = name;

        this.p = document.createElement('p');
        this.p.className = "s-channel";// col s6

        this.checkbox = document.createElement('input');
        this.checkbox.type = 'checkbox';
        this.checkbox.id = key;
        // this.checkbox.className = 'left-align';
        this.p.appendChild(this.checkbox);

        let label = document.createElement('label');
        label.className = 's-label';
        label.setAttribute('for', key);
        this.p.appendChild(label);

        this.a = document.createElement('a');
        this.a.className = 's-link';
        this.a.setAttribute('target', '_blank');
        this.a.setAttribute('href', url);
        this.a.innerHTML = name;

        let image = document.createElement('img');
        image.src = imageUrl;
        image.className = 's-icon circle';//circle
        label.appendChild(image);
        label.appendChild(this.a);

        // console.log(image.src, image.height);
    }

    set lastItem(value){
        if(value){
            this.p.style.marginBottom = 0;
        }
    }

    set checked(value){
        if(value)
            this.checkbox.setAttribute('checked', '');
        else
            this.checkbox.removeAttribute('checked');
    }

    displayTooltip(text){
        this.a.className = 'tooltipped';
        this.a.setAttribute('data-position', "right");
        this.a.setAttribute('data-tooltip', text);
    }

    registerChangeHandler(handler){
        this.checkbox.onchange = () => handler(this.checkbox);
    }

    render(container) {
        container.appendChild(this.p);
    }
}