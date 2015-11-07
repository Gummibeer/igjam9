IggjLobbyScreen = function (stageHandler ,eventHandler, networkHandler) {

    var _socket = null;
    var _$mainContainer = null;
    var _$playerList = null;
    var _$playerName = null;
    var _$requestScreen = null;

    var _init = function() {
        console.log('CREATE LOBBY');
        _socket = networkHandler.getNetworkSocket();
        _createUI();
        _initListeners();
        _joinLobby();
    };

    var _initListeners = function() {
        _socket.on('userList', _onLobbyJoined);
        _socket.on('requestAborted', _onRequestAborted);
        _socket.on('gameRequest', _onGameRequest);
    };

    var _createUI = function () {
        _$mainContainer = $('<div id="lobby-main"></div>');
        _$playerList = $('<div id="lobby-player-list"></div>');
        _$playerName = $('<div id="lobby-player-name"></div>');
        _createRequestScreen();
        _$mainContainer.append(_$playerName);
        _$mainContainer.append(_$playerList);
        _$mainContainer.append(_$requestScreen);
        _$requestScreen.hide();
        stageHandler.changeScreen(_$mainContainer);
    };

    var _createRequestScreen = function() {
        _$requestScreen = $('<div id="request-screen"></div>');
        _$requestScreen.append($('<div id="request-screen-player-id"></div>'));
        _$requestScreen.append($('<div id="request-screen-ok-btn">Annehmen</div>').on('click',_acceptRequest));
        _$requestScreen.append($('<div id="request-screen-cancel-btn">Ablehnen</div>').on('click',_cancelRequest));
    };

    var _acceptRequest = function() {

    };

    var _cancelRequest = function() {

    };

    var _onGameRequest = function(data) {
        console.log('game request from', data);
        _showRequestScreen(true);
    };

    var _onLobbyJoined = function(lobbyData) {
        _$playerList.remove('.player-list-item');
        $.each(lobbyData.usersList, function(key,value){
            var $user = $('<div class="player-list-item">' + value.name + '</div>');
            $user.on('click', function(){
                _onUserItemClick(value.id);
            });
            _$playerList.append($user);
        });
    };

    var _onUserItemClick = function (id) {
        _socket.emit('requestGame',id);
        _showRequestScreen(false);
    };

    var _showRequestScreen = function (isRequested) {
        _$requestScreen.show();
    };

    var _onRequestAborted = function() {
        _$requestScreen.hide();
    };

    var _joinLobby = function(){
        console.log('Request Lobby Login')
        _socket.emit('joinLobby', localStorage.getItem('username'));
    };

    _init();
};