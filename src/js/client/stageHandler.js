var IggjStageHandler = function() {

    var _stage = null;
    var _currentDisplayObject = null;

    var _init = function() {
        _stage = $('#mainStage');
    };

    var _displayObjectOnStage = function($screenObject) {
        _currentDisplayObject.remove();
        _stage.append($screenObject);
    };

    this.changeScreen = function($screenObject) {
        if($screenObject){
            _displayObjectOnStage($screenObject);
            _currentDisplayObject = $screenObject;
        } else {
            console.log('no screen-object');
        }
    };

    _init();
};