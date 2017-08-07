import DropdownButtonType from "../types/dropdown-button-type";

export default class NavBarView {

    constructor() {

        $(".dropdown-button").dropdown({constrainWidth: false, alignment: 'right'});

        this.initButton(DropdownButtonType.UPDATE);
        this.initButton(DropdownButtonType.MARK_ALL);
        this.initButton(DropdownButtonType.RATE);
        this.initButton(DropdownButtonType.SETTINGS);

    }

    registerMenuClickHandler(callback) {
        this.menuClickHandler = callback;
    }

    initButton(id) {
        let button = document.getElementById(id);
        button.onmouseup = () => this.menuClickHandler(button);
    }
}