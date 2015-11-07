IggjTimer = function() {
    var _$mainContainer = null;
    var _runes = 10;
    var stagesImg = [
        'src/img/',
        'src/img/',
        'src/img/',
        'src/img/',
        'src/img/',
        'src/img/',
        'src/img/',
        'src/img/',
        'src/img/',
        'src/img/',
        'src/img/',
        'src/img/'
    ];

    var _init = function() {
        _$mainContainer = $('<div id="rune-container"></div>');
    };

    this.$getGolemPresenter = function() {
        return _$mainContainer;
    };

    this.decreaseRunes = function() {
        (_runes > 0) && _runes--;
        _$mainContainer.css('background-image', 'url('+stagesImg[_currentGolemStage]+')');

    };

    this.reset = function() {
        _runes = 10;
    };

    this.decreaseRunes = function() {
        _runes++;
    };


    _init();
};