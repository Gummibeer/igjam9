var IggjGameScreen = function (stageHandler, eventHandler, networkHandler, gameData) {
    var _$gameMain = null;
    var _itemHolder = null;
    var _wizardHolder = null;
    var _spellCrank = null;
    var _taskBar = null;
    var _socket = null;
    var _myId = null;

    var _init = function () {
        stageHandler.changeScreen($('<div></div>'));
        console.log('CREATE GAME SCREEN');
        _socket = networkHandler.getNetworkSocket();
        _myId = _socket.id;
        _createGameScreenElements();
        _initListeners();
        _socket.emit('waitingForRound',gameData.match);
    };

    var _initListeners = function() {
        eventHandler('itemClicked').subscribe(function(itemId){
            _socket.emit('itemSelected', {match:gameData.match, itemId: itemId});
        });

        _socket.on('newItem',function(value){
            _itemHolder.addItem(new IggjItem(value.id, value.img, value.name));
        });
        _socket.on('endRound',_onRoundEnded);
        _socket.on('startRound',_onRoundStarted);
    };

    var _onRoundEnded = function(bool) {
        console.log('round result :', bool)
        _socket.emit('waitingForRound',gameData.match);
    };

    var _onRoundStarted = function(data) {

    };

    var _createGameScreenElements = function () {
        var itemData = {};
        _$gameMain = $('<div id="game-main-frame"></div>');
        _itemHolder = new ItemHolder(eventHandler);
        if(gameData.user1.id === _socket.id){
            itemData = gameData.user1Items;
        } else {
            itemData = gameData.user2Items;
        }
        $.each(itemData,function(key, value){
            _itemHolder.addItem(new IggjItem(value.id, value.img, value.name));
        });
        _wizardHolder = new IggjWizardsHolder();
        _spellCrank = new IggjSpellCrank();
        _taskBar = new IggjTaskBar();
        _$gameMain.append(_wizardHolder.$getWizardsHolder());
        _$gameMain.append(_itemHolder.$getShelf());
        _$gameMain.append(_spellCrank.$getSpellCrank());
        _$gameMain.append(_taskBar.$getTaskbar());

        stageHandler.changeScreen(_$gameMain);
    };

    this.destroy = function () {

    };

    _init();
};