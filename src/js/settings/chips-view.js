export default class ChipsView {
    /**
     * @param {SettingsStorage} settingsStorage
     */
    constructor(settingsStorage) {
        this._settingsStorage = settingsStorage;
        this._settingsStorage.getTags().then(chips => this.initChips(chips));
    }

    initChips(chips) {
        console.log('chips:', chips);

        $('.chips-initial').material_chip({
            data: chips,
            placeholder: 'Введіть слово',
            secondaryPlaceholder: 'Введіть слово'// та натисніть клавішу Enter
        });

        $('.chips').on('chip.add', (e, chip) => this.chipAddHandler(chip));
        $('.chips').on('chip.delete', (e, chip) => this.chipRemoveHandler(chip));
    }

    chipAddHandler(chip) {
        this._settingsStorage.addTag(chip);
    }

    chipRemoveHandler(chip) {
        this._settingsStorage.removeTag(chip);
    }

}