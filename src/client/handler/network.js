var IggjNetworkHandler = function () {
    var _socket = null;
    var _init = function () {
        _socket = io();
        _socket.on('userId',_storeUserIdIntoLS)
    };

    var _storeUserIdIntoLS = function(data) {
        localStorage.setItem('userid',data);
    };

    this.getNetworkSocket = function () {
        return _socket;
    };
    _init();
};