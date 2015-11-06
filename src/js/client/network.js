var IggjNetworkHandler = function() {
    var _socket = null;
    var _init = function() {
        _socket = io();
    };

    this.getNetworkSocket = function() {
        return _socket;
    };
    _init();
};