var IggjGameScreen = function(stageHandler ,eventHandler, networkHandler) {
    var _init = function() {
        stageHandler.changeScreen($('<div></div>'));
        console.log('CREATE GAME SCREEN')
    };

    _init();
};