import DropdownButtonType from "../types/dropdown-button-type";

export default class NavBarView {

    constructor() {

        this.initSearchBar();

        $(".dropdown-button").dropdown({constrainWidth: false, alignment: 'left'});

        this.initButton(DropdownButtonType.UPDATE, this.menuClickHandler);
        this.initButton(DropdownButtonType.SORT, this.menuClickHandler);
        this.initButton(DropdownButtonType.MARK_ALL, this.menuClickHandler);
        this.initButton(DropdownButtonType.RATE, this.menuClickHandler);
        this.initButton(DropdownButtonType.SETTINGS, this.menuClickHandler);
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