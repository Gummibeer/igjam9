var IggjGameScreen = function (stageHandler, eventHandler, networkHandler) {
    var _init = function () {
        stageHandler.changeScreen($('<div></div>'));
        console.log('CREATE GAME SCREEN')
        _createGameScreenElements();
    };

    var _createGameScreenElements = function () {

    };

    this.destroy = function () {

    };

    _init();
};