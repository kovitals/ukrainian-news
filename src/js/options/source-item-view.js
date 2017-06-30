/**
 * Created by valeriyb on 6/27/2017.
 */
class SourceItemView {

    constructor(key, name, isChecked) {

        this.key = key;
        this.name = name;
        this.isChecked = isChecked;

        this.p = document.createElement('p');
        this.p.className = "s-channel col s6";

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = key;
        // checkbox.className = 'tooltipped';
        // checkbox.data-position = "bottom";
        // checkbox.data-delay = "50";
        // checkbox.data-tooltip = "I am tooltip";
        if (isChecked) checkbox.checked = true;
        checkbox.onchange = () => this.checkboxChangeHandler(checkbox);
        this.p.appendChild(checkbox);

        let label = document.createElement('label');
        label.for = key;
        label.className = 'tooltipped';
        label['data-tooltip'] = "I am tooltip";
        label['data-position'] = "bottom";
        label['data-delay'] = "50";
        this.p.appendChild(label);

        let image = document.createElement('img');
        image.src = `img/${key}-icon.ico`;
        image.className = 's-icon';
        label.appendChild(image);

        label.innerHTML += name;

        //class="btn tooltipped" data-position="bottom" data-delay="50" data-tooltip="I am tooltip"

        //${channel.name}</label>`;//<a href="${channel.http}" target="_blank" class="s-link">${channel.name}</a>


        // p.innerHTML = `
        //                 <label for="${key}"><img src="img/${key}-icon.ico" class="s-icon white-text">${channel.name}</label>`;//<a href="${channel.http}" target="_blank" class="s-link">${channel.name}</a>


    }

    render(container) {
        container.appendChild(this.p);
    }

    checkboxChangeHandler(checkbox) {
        console.log(checkbox);
    }
}

export default SourceItemView;