IggjLobbyScreen = function (stageHandler, eventHandler, networkHandler) {

    var _socket = null;
    var _$mainContainer = null;
    var _$logo = null;
    var _$playerList = null;
    var _$playerLogout = null;
    var _$requestScreen = null;
    var _$overlay = null;
    var _myName = '';
    var _myId = '';
    var _currentRequestId = '';
    var _abortRequestTimeout = null;

    var _init = function () {
        document.getElementById('lobby_screen').play(); // 122sec
        console.log('CREATE LOBBY');
        _myId = localStorage.getItem('userid');
        _myName = localStorage.getItem('username')
        _socket = networkHandler.getNetworkSocket();
        _createUI();
        _initListeners();
        _joinLobby();
    };

    var _initListeners = function () {
        _socket.on('userList', _onLobbyJoined);
        _socket.on('requestAborted', _onRequestAborted);
        _socket.on('gameRequest', _onGameRequest);
        _socket.on('disconnect', _onDisconnected);
    };

    var _createUI = function () {
        _$mainContainer = $('<div id="lobby-main"></div>');
        _$logo = $('<img src="src/img/logo.png" id="logo" />');
        _$playerList = $('<fieldset id="lobby-player-list"></fieldset>');
        var $label = $('<legend></legend>').text(_myName + ', Choose your mate');
        _$playerList.append($label);
        _$playerLogout = $('<span id="lobby-player-logout" class="btn"></span>').on('click', _onPlayerLogoutClick);
        _createRequestScreen();
        _$mainContainer.append(_$logo);
        _$mainContainer.append(_$playerList);
        _$mainContainer.append(_$playerLogout);
        _$mainContainer.append(_$overlay);
        _$overlay.hide();
        stageHandler.changeScreen(_$mainContainer);
    };

    var _onPlayerLogoutClick = function () {
        document.getElementById('lobby_screen').pause();
        console.log('logout and destroy session');
        clearInterval(_abortRequestTimeout);
        localStorage.removeItem('username');
        _socket.emit('disconnect');
    };

    var _createRequestScreen = function () {
        _$overlay = $('<div id="overlay"></div>');
        _$requestScreen = $('<div id="request-screen" class="modal"></div>');
        _$overlay.append(_$requestScreen);
        _$requestScreen.append($('<div id="request-screen-player-id"></div>'));
        _$requestScreen.append($('<div id="request-screen-ok-btn" class="btn btn-primary">Annehmen</div>').on('click', _acceptRequest).hide());
        _$requestScreen.append($('<div id="request-screen-cancel-btn" class="btn btn-default">Ablehnen</div>').on('click', _cancelRequest).hide());
    };

    var _acceptRequest = function () {
        clearInterval(_abortRequestTimeout);
        document.getElementById('lobby_screen').pause();
        _socket.emit('acceptRequest', _currentRequestId);
    };

    var _cancelRequest = function () {
        clearInterval(_abortRequestTimeout);
        _$overlay.hide();
        _socket.emit('abortRequest', _currentRequestId);
    };

    var _onGameRequest = function (data) {
        console.log('game request from', data);
        _currentRequestId = data.userData.id;
        _showRequestScreen(true, data.userData.name);
    };

    var _onLobbyJoined = function (lobbyData) {
        console.log('get new Userlist');
        $('.player-list-item').remove();
        $.each(lobbyData.usersList, function (key, value) {
            if (value.id !== _socket.id) {
                var $user = $('<div class="player-list-item">' + value.name + '</div>');
                $user.on('click', function () {
                    _onUserItemClick(value.id, value.name);
                });
                _$playerList.append($user);
            }
        });
    };

    var _onUserItemClick = function (id, name) {
        console.log('requesting game with user ' + id + ' and name ' + name);
        _currentRequestId = id;
        _socket.emit('requestGame', id);
        _showRequestScreen(false, name);
    };

    var _showRequestScreen = function (isRequested, name) {
        if (isRequested) {
            $('#request-screen-player-id').text('Ein Spiel wird von ' + name + ' angefragt.');
            $('#request-screen-ok-btn').show();
            $('#request-screen-cancel-btn').show();
        } else {
            $('#request-screen-ok-btn').hide();
            $('#request-screen-cancel-btn').hide();
            $('#request-screen-player-id').text('Frage Spiel bei Spieler ' + name + ' an.').append('<div><i class="fa fa-2x fa-spinner fa-pulse"></i></div>');
        }
        _$overlay.show();
        _abortRequestTimeout = setTimeout(function () {
            _cancelRequest();
        }, (60 * 1000));
    };

    var _onRequestAborted = function () {
        clearInterval(_abortRequestTimeout);
        _$overlay.hide();
    };

    var _joinLobby = function () {
        console.log('Request Lobby Login');
        _socket.emit('joinLobby', _myName);
    };

    var _onDisconnected = function () {
        console.log('Disconnected / Kicked');
        location.reload();
    };

    this.destroy = function () {
        document.getElementById('lobby_screen').pause();
        clearTimeout(_abortRequestTimeout);
        _socket.off('userList', _onLobbyJoined);
        _socket.off('requestAborted', _onRequestAborted);
        _socket.off('gameRequest', _onGameRequest);
        _socket.off('disconnect', _onDisconnected);
        _socket.off('userList');
        _socket.off('requestAborted');
        _socket.off('gameRequest');
        _socket.off('disconnect');
    };

    _init();
};