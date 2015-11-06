var IggjGame = function() {

    var _socket = null;
    var _mainStage = null;

    var _init =function() {
        console.log('game init started');
        _socket = io();

    };

    _init();
};

