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
        var lobbyScreen = new IggjLobbyScreen(_stageHandler, _eventHandler, _networkSocket);
        var socket = _networkSocket.getNetworkSocket();
        socket.on('initGame', function (data) {
            console.log('init game ', data);
            lobbyScreen.destroy();
            _createGameScreen();
        });
    };

    var _createGameScreen = function (data) {
        console.log('start game screen');
        var game = new IggjGameScreen(_stageHandler, _eventHandler, _networkSocket, data);
        var socket = _networkSocket.getNetworkSocket();
        socket.on('gameOver', function () {
            game.destroy();
            _createLobby();
        });
    };

    var _createStartScreen = function (_stageHandler, _eventHandler) {
        return new IggjStartScreen(_stageHandler, _eventHandler);
    };

    _init();
};

