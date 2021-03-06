IggjTimer = function () {
    var _$mainContainer = null;
    var _runes = 10;
    var stagesImg = [
        'src/img/runen/0.png',
        'src/img/runen/1.png',
        'src/img/runen/2.png',
        'src/img/runen/3.png',
        'src/img/runen/4.png',
        'src/img/runen/5.png',
        'src/img/runen/6.png',
        'src/img/runen/7.png',
        'src/img/runen/8.png',
        'src/img/runen/9.png',
        'src/img/runen/10.png'
    ];

    $.each(stagesImg, function (k, v) {
        var img = new Image(v);
        img.src = v;
    });

    var _init = function () {
        _$mainContainer = $('<div id="rune-container"></div>');
    };

    this.$getGolemPresenter = function () {
        return _$mainContainer;
    };

    this.reset = function () {
        _runes = 10;
        _$mainContainer.css('background-image', 'url(' + stagesImg[_runes] + ')');
    };

    this.decreaseRunes = function () {
        console.log('decrease runes');
        if(_runes > 0){
            _runes--;
            _$mainContainer.css('background-image', 'url(' + stagesImg[_runes] + ')');
        }
    };

    this.increaseRunes = function () {
        if(runes < 10) {
            _runes++;
        }

    };

    _init();
};