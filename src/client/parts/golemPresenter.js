IggjGolemPresenter = function(eventHandler) {
    var _$mainContainer = null;
    var _$golem = null;
    var _currentGolemStage = 0;
    var _stageToWin = 6;
    var stagesImg = [
        'src/img/dolem_final_stufe_0.png',
        'src/img/dolem_final_stufe_1.png',
        'src/img/dolem_final_stufe_2.png',
        'src/img/dolem_final_stufe_3.png',
        'src/img/dolem_final_stufe_4.png',
        'src/img/dolem_final_stufe_5.png',
        'src/img/dolem_final_stufe_6.png'
    ];

    var _init = function() {
        _$mainContainer = $('<div id="golem-main"></div>');
        _$golem = $('<div id="golem"></div>');
        _$mainContainer.append(_$golem);
        _$golem.css('background-image', 'url('+stagesImg[_currentGolemStage]+')');
    };

    this.$getGolemPresenter = function() {
        return _$mainContainer;
    };

    this.decreaseGolemStage = function() {
        _currentGolemStage--;
        _$golem.css('background-image', 'url('+stagesImg[_currentGolemStage]+')');
        if(_currentGolemStage<0){
            eventHandler('gameOver').publish();
            console.log('loose');
        }
    };

    this.increaseGolemStage = function() {
        _currentGolemStage++;
        _$golem.css('background-image', 'url('+stagesImg[_currentGolemStage]+')');
        if (_currentGolemStage === _stageToWin) {
            console.log('win');
        }
    };

    _init();
};