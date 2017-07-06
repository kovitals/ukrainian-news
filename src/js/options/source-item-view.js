/**
 * Created by valeriyb on 6/27/2017.
 */
class SourceItemView {

    constructor(key, name, url, tooltip, isChecked, changeHandler) {

        this.key = key;
        this.name = name;
        this.isChecked = isChecked;

        // console.log(key, isChecked);

        this.span = document.createElement('span');
        this.span.className = "s-channel col s6";

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = key;
        if (isChecked) checkbox.checked = true;
        checkbox.onchange = () => changeHandler(checkbox);
        this.span.appendChild(checkbox);

        let label = document.createElement('label');
        label.setAttribute('for', key);
        this.span.appendChild(label);

        let a = document.createElement('a');
        a.className = 's-link';
        a.setAttribute('target', '_blank');
        a.setAttribute('href', url);
        a.className = 'tooltipped';
        a.setAttribute('data-position', "right");
        a.setAttribute('data-tooltip', tooltip);
        a.innerHTML = name;

        let image = document.createElement('img');
        image.src = `img/${key}-icon.ico`;
        image.className = 's-icon';
        label.appendChild(image);
        label.appendChild(a);
    }

    render(container) {
        container.appendChild(this.span);
    }
}

export default SourceItemView;