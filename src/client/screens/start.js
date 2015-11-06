var IggjStartScreen = function (stageHandler, eventHandler) {

    var _startScreen;
    var KEY_ENTER = 13;

    var _init = function () {
        if (localStorage.getItem('username')) {
            eventHandler.publish('startScreenFinished');
        } else {
            _createStartScreen();
            stageHandler.changeScreen(_startScreen);
        }
    };

    var _createInput = function () {
        var input = document.createElement('input');
        input.setAttribute('id', 'input-username');
        input.setAttribute('type', 'text');
        input.setAttribute('value', 'username');
        input.style.display = 'block';
        input.style.margin = 'auto';
        input.addEventListener('keypress', function (e) {
            if (e.keyCode === KEY_ENTER) {
                var name = document.getElementById('input-username').value;
                localStorage.setItem('username', name);
                eventHandler.publish('startScreenFinished');
            }
        });
        input.addEventListener('focus', function () {
            this.value = '';
        });
        return input;
    };

    var _createInputDiv = function () {
        var inputDiv = document.createElement('div');
        inputDiv.style.position = 'relative';
        inputDiv.style.top = '50%';
        return inputDiv;
    };

    var _createHolder = function () {
        var holder = document.createElement('div');
        holder.style.position = 'absolute';
        holder.style.height = '100%';
        holder.style.width = '100%';
        holder.style.backgroundImage = '';
        return holder;
    };

    var _createStartScreen = function () {
        var input = _createInput();
        var inputDiv = _createInputDiv()
        _startScreen = _createHolder();
        inputDiv.appendChild(input);
        _startScreen.appendChild(inputDiv);
        _startScreen = $(_startScreen);
    };

    this.destroy = function () {
    };

    _init();
};