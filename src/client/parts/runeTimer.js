IggjTimer = function() {
    var _$mainContainer = null;
    var _runes = 10;
    var stagesImg = [
        'src/img/runes/0.png',
        'src/img/runes/1.png',
        'src/img/runes/2.png',
        'src/img/runes/3.png',
        'src/img/runes/4.png',
        'src/img/runes/5.png',
        'src/img/runes/6.png',
        'src/img/runes/7.png',
        'src/img/runes/8.png',
        'src/img/runes/9.png',
        'src/img/runes/10.png'
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