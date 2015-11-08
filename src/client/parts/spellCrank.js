var IggjSpellCrank = function (eventHandler) {

    var _$mainContainer = null;
    var _interval = null;
    var _currentPicture = 1;
    var INTERVAL = 150;
    var _audio = document.getElementById('spell_crank');

    var _init = function () {
        _createSpellCrank();
    };

    var _createSpellCrank = function () {
        _$mainContainer = $('<div id="spell-crank" class ="spellcrank-1"></div>');
        _$mainContainer.on('click', function () {
            _stopInterval();
            _nextBackground();
        });
        _$mainContainer.on('mousedown', function () {
            _startInterval();
        });
        _$mainContainer.on('mouseup', function () {
            _stopInterval();
        });
        _$mainContainer.on('mouseleave', function () {
            _stopInterval();
        });
    };

    var _nextBackground = function () {
        _currentPicture++;
        _audio.play();
        if (_currentPicture === 5) {
            _currentPicture = 1;
        }
        document.getElementById('spell-crank').className = 'spellcrank-' + _currentPicture;
        eventHandler('spellCrankUsed').publish();
    };

    var _startInterval = function () {
        _interval = setInterval(_nextBackground, INTERVAL);
    };

    var _stopInterval = function () {
        clearInterval(_interval);
    };

    this.$getSpellCrank = function () {
        return _$mainContainer;
    };

    _init();
};