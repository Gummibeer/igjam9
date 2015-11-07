IggjLobbyScreen = function (stageHandler ,eventHandler, networkHandler) {

    var socket = null;

    var _init = function() {
        console.log('CREATE LOBBY');
        socket = networkHandler.getNetworkSocket();
        _initListeners();
        _joinLobby();
    };

    var _initListeners = function() {
        socket.on('userList', _onLobbyJoined);
    };

    var _onLobbyJoined = function(lobbyData) {
        console.log(lobbyData)
    };

    var _joinLobby = function(){
        console.log('Request Lobby Login')
        socket.emit('joinLobby', localStorage.getItem('username'));
    };

    _init();
};