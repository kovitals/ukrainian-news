import DropdownButtonType from "../types/dropdown-button-type";

export default class NavBarView {

    constructor() {

        this.search = document.getElementById('search');
        this.search.oninput = () => this.searchTextHandler(this.search.value);

        $(".dropdown-button").dropdown({constrainWidth: false, alignment: 'left'});

        this.initButton(DropdownButtonType.UPDATE);
        this.initButton(DropdownButtonType.SORT);
        this.initButton(DropdownButtonType.MARK_ALL);
        this.initButton(DropdownButtonType.RATE);
        this.initButton(DropdownButtonType.SETTINGS);

    }

    showSerchBar(){
        // this.search
    }

    hideSerchBar(){

    }

    registerSearchTextHandler(callback) {
        this.searchTextHandler = callback;
    }

    registerMenuClickHandler(callback) {
        this.menuClickHandler = callback;
    }

    initButton(id) {
        let button = document.getElementById(id);
        button.onmouseup = () => this.menuClickHandler(button);
    }
}