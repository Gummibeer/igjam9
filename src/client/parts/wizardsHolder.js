var wizardsHolder = function() {

    var _$mainContainer = null;
    var _$spellInput = null;
    var _$spellBook = null;
    var KEY_ENTER = 13;
    var _currentSpell = null;
    var _spellEnterTime = 0;
    var _spellEndTime = 0;
    var _callback = null;

    var _init = function() {
        _createWizardsHolder();
    };

    this.setSpell = function(spell, time, callback) {
        _callback = callback;
        _currentSpell = spell;
        _spellEndTime = new Date().getTime()+time*1000;
    };

    var _createWizardsHolder = function() {
        _$mainContainer = $('<div id="wizards-main"></div>');
        _$spellInput = $('<input id="spell-input" type = "text" />');
        _$spellInput.addEventListener('keypress', function (e) {
            if (e.keyCode === KEY_ENTER) {
                _spellEnterTime = new Date();
                if((_$spellInput.value == _currentSpell) && (_spellEnterTime < _spellEndTime)) {
                    _callback(1);
                } else {
                    _callback(0);
                }
                _$spellInput.value = '';
            }
        });
        _$spellBook = $('<div id="spell-book"></div>');
        _$mainContainer.append(_$spellInput);
        _$mainContainer.append(_$spellBook);
    };

    this.getWizardsHolder = function() {
        return _$mainContainer;
    };

    _init()
};