import DropdownButtonType from "../types/dropdown-button-type";

export default class NavBarView {

    constructor() {

        this.initSearchBar();

        $(".dropdown-button").dropdown({constrainWidth: false, alignment: 'left', outDuration: 125});

        this.initButton(DropdownButtonType.UPDATE, button => this.menuClickHandler(button));
        this.initButton(DropdownButtonType.SORT, button => this.menuClickHandler(button));
        this.initButton(DropdownButtonType.MARK_ALL, button => this.menuClickHandler(button));
        this.initButton(DropdownButtonType.RATE, button => this.menuClickHandler(button));
        this.initButton(DropdownButtonType.SETTINGS, button => this.menuClickHandler(button));
    }

    initSearchBar() {
        this.searchBar = document.getElementById('p-search');

        this.searchField = document.getElementById('search');
        this.searchField.oninput = () => this.searchTextHandler(this.searchField.value);
        this.searchField.onblur = () => this.hideSearchBar();

        this.hideSearchBar();

        this.initButton('i-search', () => this.showSearchBar());
        this.initButton('i-close', () => this.hideSearchBar());
    }

    showSearchBar() {
        this.searchBar.style.display = 'inline';
        this.searchField.focus();
    }

    hideSearchBar() {
        this.searchBar.style.display = 'none';
        // this.searchField.value = '';
    }

    /**
     * @return {boolean}
     */
    get isSearchBarVisible() {
        return this.searchBar.style.display == 'inline';
    }

    registerSearchTextHandler(callback) {
        this.searchTextHandler = callback;
    }

    registerMenuClickHandler(callback) {
        this.menuClickHandler = callback;
    }

    /**
     * @param {string} id
     * @param {function} handler
     */
    initButton(id, handler) {
        let button = document.getElementById(id);
        button.onmouseup = () => handler(button);
    }
}