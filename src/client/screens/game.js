var IggjGameScreen = function (stageHandler, eventHandler, networkHandler, gameData) {
    var _$gameMain = null;
    var _itemHolder = null;
    var _wizardHolder = null;
    var _socket = null;
    var _myId = null;

    var _init = function () {
        stageHandler.changeScreen($('<div></div>'));
        console.log('CREATE GAME SCREEN');
        _socket = networkHandler.getNetworkSocket();
        _myId = _socket.id;
        _createGameScreenElements();
        _initListeners();
    };

    var _initListeners = function() {

    };

    var _createGameScreenElements = function () {
        _$gameMain = $('<div id="game-main-frame"></div>');
        _itemHolder = new ItemHolder();
        _wizardHolder = new IggjWizardsHolder();
        _$gameMain.append(_wizardHolder.$getWizardsHolder());
        _$gameMain.append(_itemHolder.$getShelf());

        stageHandler.changeScreen(_$gameMain);
    };

    this.destroy = function () {

    };

    _init();
};