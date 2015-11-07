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
        _$gameMain.append(_itemHolder.$getShelf());
        new IggjItem(Math.round(Math.random()*1000),'none')

        setTimeout(function(){_itemHolder.addItem(new IggjItem(Math.round(Math.random()*1000),'none'))}, 1000);
        setTimeout(function(){_itemHolder.addItem(new IggjItem(Math.round(Math.random()*1000),'none'))}, 2000);
       // setTimeout(function(){_itemHolder.addItem(new IggjItem(Math.round(Math.random()*1000),'none'))}, 3000);
       // setTimeout(function(){_itemHolder.addItem(new IggjItem(Math.round(Math.random()*1000),'none'))}, 4000);

        stageHandler.changeScreen(_$gameMain);
    };

    this.destroy = function () {

    };

    _init();
};