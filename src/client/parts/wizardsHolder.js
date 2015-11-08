var IggjWizardsHolder = function (eventHandler) {

    var _$mainContainer = null;
    var _$spellBook = null;
    var _currentSpell = null;
    var _callback = null;
    var _audio = document.getElementById('spell_book');

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
        _$spellBook.on('click', function () {
            _audio.play();
            eventHandler('spellBookUsed').publish();
            _$spellBook.addClass('active');
            setTimeout(function () {
                _$spellBook.removeClass('active');
            }, 300);
        });
    };

    this.$getWizardsHolder = function () {
        return _$mainContainer;
    };

    _init()
};