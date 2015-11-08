var IggjWizardsHolder = function () {

    var _$mainContainer = null;
    var _$spellInput = null;
    var _$spellBook = null;
    var KEY_ENTER = 13;
    var _currentSpell = null;
    var _spellEnterTime = 0;
    var _spellEndTime = 0;
    var _callback = null;

    var _init = function () {
        _createWizardsHolder();
    };

    this.setSpell = function (spell, time, callback) {
        _callback = callback;
        _currentSpell = spell;
        _spellEndTime = new Date().getTime() + time * 1000;
    };

    var _createWizardsHolder = function () {
        _$mainContainer = $('<div id="spellbook-container"></div>');
        _$spellBook = $('<div id="spell-book"></div>');
        _$spellInput = $('<input id="spell-input" type = "text" />');
        _$spellInput.on('keypress', function (e) {
            if (e.keyCode === KEY_ENTER) {
                _spellEnterTime = new Date().getTime();
                if ((_$spellInput.value == _currentSpell) && (_spellEnterTime < _spellEndTime)) {
                    _callback(1);
                } else {
                    _callback(0);
                }
                document.getElementById('spell-input').value = '';
            }
        });
        _$mainContainer.append(_$spellBook);
        _$mainContainer.append(_$spellInput);
    };

    this.$getWizardsHolder = function () {
        return _$mainContainer;
    };

    _init()
};