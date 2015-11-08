var IggjTaskBar = function () {

    var $container = null;
    var _currentTask = '';

    var _init = function () {
        $container = $('<div id = "taskbar"></div>');
        $container.innerHTML = "Packe Zutat A in den Topf!";
    };

    this.setTask = function (task) {
        _currentTask = task;
        document.getElementById('taskbar').innerHTML = task;
    };

    this.getTask = function () {
        return _currentTask;
    };

    this.solveTask = function () {
        _currentTask = '';
        document.getElementById('taskbar').innerHTML = '';
    }

    this.$getTaskbar = function () {
        return $container;
    };

    _init();

};