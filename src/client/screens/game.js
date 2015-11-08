var IggjGameScreen = function (stageHandler, eventHandler, networkHandler, gameData) {
    var _$gameMain = null;
    var _itemHolder = null;
    var _wizardHolder = null;
    var _golemPresenter = null;
    var _timer = null;
    var _timerInterval = null;
    var _spellCrank = null;
    var _taskBar = null;
    var _socket = null;
    var _myId = null;
    var _roundDecisionCounter = 0;
    var _gameFinished = false;
    var that = this;

    var _init = function () {
        stageHandler.changeScreen($('<div></div>'));
        console.log('CREATE GAME SCREEN');
        _socket = networkHandler.getNetworkSocket();
        _myId = _socket.id;
        _createGameScreenElements();
        _initListeners();
        _socket.emit('waitingForRound', gameData.match);
    };

    var _initListeners = function () {
        eventHandler('itemClicked').subscribe(function (element) {
            if (_roundDecisionCounter < 2) {
                console.log('removing item with id', $(element).attr('item-id'));
                var itemId = $(element).attr('item-id');
                $(element).attr('data-empty', true);
                $(element).css('background-Image', 'none');
                $(element).removeAttr('item-id');
                $(element).off('click');
                _socket.emit('itemSelected', {match: gameData.match, itemId: itemId});
                _roundDecisionCounter++;
            }
        });

        eventHandler('spellCrankUsed').subscribe(function () {
            if (_roundDecisionCounter < 2) {
                _socket.emit('spellCrankUsed', {match: gameData.match});
                _roundDecisionCounter++;
            }
        });

        eventHandler('gameOver').subscribe(function () {
            console.log('gamescreen receiver game over');
            _gameFinished = true;
            _socket.emit('gameEnded', gameData.match);
            _showGameOver(function () {
                _socket.emit('disconnect');
                eventHandler('returnToLobby').publish();
            });
        });

        eventHandler('gameWon').subscribe(function () {
            console.log('gameJS received game won');
            _gameFinished = true;
            _socket.emit('gameEnded', gameData.match);
            _showGameWon(function () {
                _socket.emit('disconnect');
                eventHandler('returnToLobby').publish();
            });
        });

        _socket.on('newItem', function (value) {
            _itemHolder.addItem(new IggjItem(value.item.id, value.item.img, value.item.name));
        });
        _socket.on('endRound', _onRoundEnded);
        _socket.on('startRound', _onRoundStarted);
        _socket.on('disconnect', _onDisconnected);
    };

    var _onDisconnected = function() {
        console.log('Game: Disconnected / Kicked');
        var $gameOver = $('<div id="game-over"></div>');
        $gameOver.css('background-image', 'url(src/img/bg_loose.jpg)')
        stageHandler.changeScreen($gameOver);
        setTimeout(function(){eventHandler('returnToLobby').publish()}, 5000);
    };

    var _showGameOver = function (callback) {
        _$gameMain.remove();
        clearInterval(_timerInterval)
        that.destroy();
        var $gameOver = $('<div id="game-over"></div>');
        $gameOver.css('background-image', 'url(src/img/bg_loose.jpg)')
        stageHandler.changeScreen($gameOver);
        setTimeout(callback, 5000);
    };

    var _showGameWon = function (callback) {
        _$gameMain.remove();
        clearInterval(_timerInterval)
        that.destroy();
        var $gameWon = $('<div id="game-won"></div>');
        $gameWon.css('background-image', 'url(src/img/bg_win.jpg)')
        stageHandler.changeScreen($gameWon);
        setTimeout(callback, 5000);
    };

    var _onRoundEnded = function (roundResult) {
        console.log('round result :', roundResult)
        if (roundResult) {
            _golemPresenter.increaseGolemStage();
        } else {
            _golemPresenter.decreaseGolemStage();
        }
        clearInterval(_timerInterval);
        _timer.reset();
        _socket.emit('waitingForRound', gameData.match);
    };

    var _onRoundStarted = function (data) {
        _roundDecisionCounter = 0;
        _itemHolder.allowedToClick = true;
        _taskBar.setTask(data.task && data.task.message);
        _timer.reset();
        _timerInterval = setInterval(function () {
            if(!_gameFinished) {
                _timer.decreaseRunes();
            }
        }, 510);
    };

    var _createGameScreenElements = function () {
        var itemData = {};
        _$gameMain = $('<div id="game-main-frame"></div>');
        _itemHolder = new ItemHolder(eventHandler);
        if (gameData.user1.id === _socket.id) {
            itemData = gameData.user1Items;
        } else {
            itemData = gameData.user2Items;
        }
        $.each(itemData, function (key, value) {
            _itemHolder.addItem(new IggjItem(value.id, value.img, value.name));
        });
        _wizardHolder = new IggjWizardsHolder();
        _spellCrank = new IggjSpellCrank(eventHandler);
        _taskBar = new IggjTaskBar();
        _timer = new IggjTimer();
        _golemPresenter = new IggjGolemPresenter(eventHandler);
        _$gameMain.append(_golemPresenter.$getGolemPresenter());
        _$gameMain.append(_wizardHolder.$getWizardsHolder());
        _$gameMain.append(_itemHolder.$getShelf());
        _$gameMain.append(_spellCrank.$getSpellCrank());
        _$gameMain.append(_taskBar.$getTaskbar());
        _$gameMain.append(_timer.$getGolemPresenter());

        stageHandler.changeScreen(_$gameMain);
    };

    this.destroy = function () {
        _socket.off('newItem');
        _socket.off('endRound');
        _socket.off('startRound');
        _socket.off('disconnect');
        eventHandler('itemClicked').unsubscribe();
        eventHandler('gameOver').unsubscribe();
        eventHandler('gameWon').unsubscribe();
        _wizardHolder = null;
        _golemPresenter = null;
        _spellCrank = null;
        _taskBar = null;
    };

    _init();
};