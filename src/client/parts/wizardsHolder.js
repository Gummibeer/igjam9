var IggjWizardsHolder = function () {

    var _$mainContainer = null;
    var _$spellBook = null;
    var _currentSpell = null;
    var _callback = null;

    var _init = function () {
        _createWizardsHolder();
    };

    this.setSpell = function (spell, time, callback) {
        _callback = callback;
        _currentSpell = spell;
    };

    var _createWizardsHolder = function () {
        _$mainContainer = $('<div id="spellbook-container"></div>');
        _$spellBook = $('<div id="spell-book"></div>');
        _$mainContainer.append(_$spellBook);
    };

    this.$getWizardsHolder = function () {
        return _$mainContainer;
    };

    _init()
};