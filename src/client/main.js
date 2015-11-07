var IggjGame = function () {

    var _networkSocket = null;
    var _eventHandler = null;
    var _stageHandler = null;

    var _init = function () {
        console.log('game init started');
        _networkSocket = new IggjNetworkHandler();
        _eventHandler = IggjEventHandler;
        _stageHandler = new IggjStageHandler();
        console.log('initFinished')
        _startGame();
    };

    var _startGame = function () {
        _eventHandler('startScreenFinished').subscribe(function () {
            console.log('exit StartScreen')
            _createLobby();
        });
        _createStartScreen(_stageHandler, _eventHandler);
    };

    var _createLobby = function () {
        var lobbyScreen = new IggjLobbyScreen();
        var socket = _networkSocket.getNetworkSocket();
        socket.on('initGame', function () {
            lobbyScreen.destroy();
            _createGameScreen();
        });
    };

    var _createGameScreen = function () {
        var game = new IggjGameScreen(_networkSocket);
        var socket = _networkSocket.getNetworkSocket();
        socket.on('gameOver', function () {
            game.destroy();
            _createLobby();
        });
    };

    var _createStartScreen = function (stageHandler, eventHandler) {
        return new IggjStartScreen(stageHandler, eventHandler);
    };

    _init();
};

