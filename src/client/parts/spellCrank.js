var IggjSpellCrank = function() {

    var _$mainContainer = null;
    var _interval = null;
    var _crankStatus = '';
    var _currentPicture = 1;
    var _crankEndTime = 0;
    var _crankEnterTime = 0;
    var INTERVAL = 500;

    var _init = function() {
        _createSpellCrank();
    };

    var _createSpellCrank = function() {
        _$mainContainer = $('<div id="spell-crank" class ="spellcrank-1"></div>');
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
        if(_currentPicture === 5) {
            _currentPicture = 1;
        }
        console.log('next');
        document.getElementById('spell-crank').className = 'spellcrank-'+_currentPicture;
        console.log(_$mainContainer.className);
    };

    var _startInterval = function() {
        console.log('interval');
        _interval = setInterval(_nextBackground, INTERVAL);
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