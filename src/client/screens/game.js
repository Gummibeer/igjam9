var IggjGameScreen = function (stageHandler, eventHandler, networkHandler, gameData) {
    var _$gameMain = null;
    var _itemHolder = null;
    var _wizardHolder = null;
    var _golemPresenter = null;
    var _spellCrank = null;
    var _taskBar = null;
    var _socket = null;
    var _myId = null;
    var _madeADecisonThisRound = false;

    //TODO: nur einmal klickbar pro round
    //TODO: golem zusammen bauen (check)
    //TODO:matchEnded senden return to Lobby (check)

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

        eventHandler('gameOver').subscribe(function(){
            _socket.emit('gameEnded', gameData.match);
            eventHandler('returnToLobby').publish();
        });

        _socket.on('newItem',function(value){
            _itemHolder.addItem(new IggjItem(value.item.id, value.item.img, value.item.name));
        });
        _socket.on('endRound',_onRoundEnded);
        _socket.on('startRound',_onRoundStarted);
    };

    var _onRoundEnded = function(roundresult) {
        console.log('round result :', roundresult)
        if(roundresult) {
            _golemPresenter.increaseGolemStage();
        } else {
            _golemPresenter.decreaseGolemStage();
        }
        _socket.emit('waitingForRound',gameData.match);
    };

    var _onRoundStarted = function(data) {
        _taskBar.setTask(data.task.message);
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
        _golemPresenter = new IggjGolemPresenter();
        _$gameMain.append(_golemPresenter.$getGolemPresenter());
        _$gameMain.append(_wizardHolder.$getWizardsHolder());
        _$gameMain.append(_itemHolder.$getShelf());
        _$gameMain.append(_spellCrank.$getSpellCrank());
        _$gameMain.append(_taskBar.$getTaskbar());

        stageHandler.changeScreen(_$gameMain);
    };

    this.destroy = function () {
        _socket.off('newItem',function(value){
            _itemHolder.addItem(new IggjItem(value.item.id, value.item.img, value.item.name));
        });
        _socket.off('endRound',_onRoundEnded);
        _socket.off('startRound',_onRoundStarted);
    };

    _init();
};