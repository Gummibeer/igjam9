IggjGolemPresenter = function (eventHandler) {
    var _$mainContainer = null;
    var _$golem = null;
    var _currentGolemStage = 0;
    var _stageToWin = 7;
    var stagesImg = [
        'src/img/golem/0.png',
        'src/img/golem/1.png',
        'src/img/golem/2.png',
        'src/img/golem/3.png',
        'src/img/golem/4.png',
        'src/img/golem/5.png',
        'src/img/golem/6.png'
    ];

    var _init = function () {
        _$mainContainer = $('<div id="golem-main"></div>');
        _$golem = $('<div id="golem"></div>');
        _$mainContainer.append(_$golem);
        _$golem.css('background-image', 'url(' + stagesImg[_currentGolemStage] + ')');
    };

    this.$getGolemPresenter = function () {
        return _$mainContainer;
    };

    this.decreaseGolemStage = function () {
        _currentGolemStage--;
        _$golem.css('background-image', 'url(' + stagesImg[_currentGolemStage] + ')');
        if (_currentGolemStage < 0) {
            eventHandler('gameOver').publish();
            console.log('loose');
        }
    };

    this.increaseGolemStage = function () {
        _currentGolemStage++;
        _$golem.css('background-image', 'url(' + stagesImg[_currentGolemStage] + ')');
        if (_currentGolemStage === _stageToWin) {
            eventHandler('gameWon').publish()
            console.log('win');
        }
    };

    _init();
};