var IggjSpellCrank = function() {

    var _$mainContainer = null;
    var _interval = null;
    var _crankStatus = '';
    var _currentPicture = 0;
    var _crankEndTime = 0;
    var _crankEnterTime = 0;

    var _init = function() {
        _createSpellCrank();
    };

    var _createSpellCrank = function() {
        _$mainContainer = $('<div id="spell-crank"></div>');
        _$mainContainer.on('click', function () {
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

    var _nextBackground = function() {
        _currentPicture++;
        if(_currentPicture === 4) {
            _currentPicture = 0;
        }
        _$mainContainer.className = 'spellcrank-'+_currentPicture;
    };

    var _startInterval = function() {
        _interval = setInterval(_nextBackground, 1000);
    };

    var _stopInterval = function() {
        clearInterval(_interval);
    };

    this.setCrank = function(crank, time, callback) {
        _crankEndTime = new Date().getTime()+time*1000;
    }

    this.$getSpellCrank = function() {
        return _$mainContainer;
    };

    _init();
};