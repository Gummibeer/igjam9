IggjGolemPresenter = function (eventHandler) {
    var _$mainContainer = null;
    var _$golem = null;
    var _currentGolemStage = 0;
    var _stageToWin = 7;
    var _audioLevelIncrease = document.getElementById('upgrade');
    var _audioGameWin = document.getElementById('game_win');
    var _audioLevelDecrease = document.getElementById('round_lost');
    var _audioGameOver = document.getElementById('game_over');
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
            _audioGameOver.play();
            eventHandler('gameOver').publish();
            console.log('loose');
        } else {
            _audioLevelDecrease.play();
        }
    };

    this.increaseGolemStage = function () {
        _currentGolemStage++;
        _$golem.css('background-image', 'url(' + stagesImg[_currentGolemStage] + ')');
        if (_currentGolemStage === _stageToWin) {
            _audioGameWin.play();
            eventHandler('gameWon').publish()
            console.log('win');
        } else {
            _audioLevelIncrease.play();
        }
    };

    this.destroy = function() {
        _audioLevelIncrease && _audioLevelIncrease.pause();
        _audioLevelDecrease && _audioLevelDecrease.pause();
        _audioGameOver &&_audioGameOver.pause();
        _audioGameWin && _audioGameWin.pause();
    }

    _init();
};