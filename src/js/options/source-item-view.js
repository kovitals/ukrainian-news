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
        if (isChecked) checkbox.checked = true;
        checkbox.onchange = () => this.checkboxChangeHandler(checkbox);
        this.p.appendChild(checkbox);

        let label = document.createElement('label');
        label.for = key;
        label.innerText = name;
        checkbox.appendChild(label);

        // p.innerHTML = `
        //                 <label for="${key}"><img src="img/${key}-icon.ico" class="s-icon white-text">${channel.name}</label>`;//<a href="${channel.http}" target="_blank" class="s-link">${channel.name}</a>


    }

    render(container) {
        container.appendChild(this.p);
    }

    checkboxChangeHandler(checkbox) {
    }
}

export default SourceItemView;