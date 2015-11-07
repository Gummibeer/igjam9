var IggjStartScreen = function (stageHandler, eventHandler) {

    var _startScreen;
    var KEY_ENTER = 13;

    var _init = function () {
        if (localStorage.getItem('username')) {
            eventHandler('startScreenFinished').publish();
        } else {
            _createStartScreen();
            stageHandler.changeScreen(_startScreen);
        }
    };

    var _createLogo = function () {
        var image = document.createElement('img');
        image.setAttribute('src', 'src/img/logo.png');
        return image;
    };

    var _createInput = function () {
        var input = document.createElement('input');
        input.setAttribute('id', 'input-username');
        input.setAttribute('type', 'text');
        input.setAttribute('autofocus', true);
        input.setAttribute('novalidate', true);
        input.style.display = 'block';
        input.style.margin = 'auto';
        input.addEventListener('keypress', function (e) {
            if (e.keyCode === KEY_ENTER) {
                var name = document.getElementById('input-username').value;
                localStorage.setItem('username', name);
                eventHandler('startScreenFinished').publish();
            }
        });
        return input;
    };

    var _createInputDiv = function () {
        var inputDiv = document.createElement('div');
        inputDiv.style.position = 'relative';
        inputDiv.style.top = '50px';
        inputDiv.style.margin = '0 auto';
        inputDiv.style.maxWidth = '600px';
        return inputDiv;
    };

    var _createHolder = function () {
        var holder = document.createElement('div');
        holder.setAttribute('id', 'start-main');
        holder.style.position = 'absolute';
        holder.style.height = '100%';
        holder.style.width = '100%';
        holder.style.backgroundImage = '';
        return holder;
    };

    var _createStartScreen = function () {
        var logo = _createLogo();
        var input = _createInput();
        var inputDiv = _createInputDiv();
        _startScreen = _createHolder();
        inputDiv.appendChild(logo);
        inputDiv.appendChild(input);
        _startScreen.appendChild(inputDiv);
        _startScreen = $(_startScreen);
    };

    this.destroy = function () {
    };

    _init();
};