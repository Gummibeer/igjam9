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
    var that = this;

    //TODO: nur einmal klickbar pro round (ckeck)
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
            if(!_madeADecisonThisRound){
                _socket.emit('itemSelected', {match:gameData.match, itemId: itemId});
                _madeADecisonThisRound = true;
                _itemHolder.allowedToClick = false;
            }
        });

        eventHandler('gameOver').subscribe(function(){
            console.log('gameJS received game over');
            _socket.emit('gameEnded', gameData.match);
            _showGameOver(function(){
                eventHandler('returnToLobby').publish();
            });
        });

        eventHandler('gameOver').subscribe(function() {
            console.log('gameJS received game won');
            _socket.emit('gameEnded', gameData.match);
            _showGameWon(function(){
                eventHandler('returnToLobby').publish();
            });
        });

        _socket.on('newItem',function(value){
            _itemHolder.addItem(new IggjItem(value.item.id, value.item.img, value.item.name));
        });
        _socket.on('endRound',_onRoundEnded);
        _socket.on('startRound',_onRoundStarted);
    };

    var _showGameOver = function(callback) {
        _$gameMain.remove();
        that.destroy();
        var $gameOver = $('<div id="game-over"></div>');
        $gameOver.css('background-image', 'url(src/img/bg_loose.jpg)')
        stageHandler.changeScreen($gameOver);
        setTimeout(callback, 5000);
    };

    var _showGameWon = function(callback) {
        _$gameMain.remove();
        that.destroy();
        var $gameWon = $('<div id="game-won"></div>');
        $gameWon.css('background-image', 'url(src/img/bg_win.jpg)')
        stageHandler.changeScreen($gameWon);
        setTimeout(callback, 5000);
    };

    var _onRoundEnded = function(roundResult) {
        console.log('round result :', roundResult)
        if(roundResult) {
            _golemPresenter.increaseGolemStage();
        } else {
            _golemPresenter.decreaseGolemStage();
        }
        _socket.emit('waitingForRound',gameData.match);
    };

    var _onRoundStarted = function(data) {
        _madeADecisonThisRound = false;
        _itemHolder.allowedToClick = true;
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
        _golemPresenter = new IggjGolemPresenter(eventHandler);
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