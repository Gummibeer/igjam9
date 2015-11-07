IggjGolemPresenter = function() {
    var _$mainContainer = null;
    var _currentGolemStage = 0;
    var _stageToWin = 6;
    var _init = function() {
        _$mainContainer = $('<div id="golem-main"></div>');
    };

    this.$getGolemPresenter = function() {
        return _$mainContainer;
    };

    this.decreaseGolemStage = function() {
        _currentGolemStage--;
        if(_currentGolemStage<0){
            console.log('loose');
        }
    };

    this.increaseGolemStage = function() {
        _currentGolemStage++;
        if (_currentGolemStage === _stageToWin) {
            console.log('win');
        }
    };

    _init();
};