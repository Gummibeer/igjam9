var IggjStartScreen = function (stageHandler, eventHandler) {

    var _startScreen;
    var KEY_ENTER = 13;
    var FRAME_DURATION = 3000;

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
        input.setAttribute('placeholder', 'enter name');
        input.setAttribute('autofocus', true);
        input.setAttribute('novalidate', true);
        input.setAttribute('maxlength', '30');
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
        inputDiv.setAttribute('id', 'input-holder');
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

    var _createTextHolder = function () {
        var textHodler = document.createElement('div');
        textHodler.setAttribute('id', 'text-holder');
        return textHodler;
    };

    var _createStartScreen = function () {
        document.getElementById('intro_screen').play(); // 9sec
        var logo = _createLogo();
        var input = _createInput();
        var inputDiv = _createInputDiv();
        var textHolder = _createTextHolder();
        _startScreen = _createHolder();
        _startScreen.appendChild(textHolder);
        var $textHolder = $(textHolder);

        $textHolder.text('Help!');
        setTimeout(function () {
            _startScreen.style.boxShadow = 'inset 0 0 5000px 5000px rgba(0,0,0,1)';
            setTimeout(function () {
                $textHolder.text('Oh no, you\'re stuck.');
                _startScreen.style.backgroundImage = 'url(../../src/img/bg_intro_2.jpg)';
                _startScreen.style.boxShadow = 'none';
                setTimeout(function () {
                    _startScreen.style.boxShadow = 'inset 0 0 5000px 5000px rgba(0,0,0,1)';
                    setTimeout(function () {
                        $textHolder.text('Let\'s team up & save him!');
                        _startScreen.style.backgroundImage = 'url(../../src/img/bg_intro_3.jpg)';
                        _startScreen.style.boxShadow = 'none';
                        setTimeout(function () {
                            _startScreen.style.boxShadow = 'inset 0 0 5000px 5000px rgba(0,0,0,1)';
                            setTimeout(function () {
                                document.getElementById('login_screen').play(); // 10sec
                                $textHolder.text('');
                                _startScreen.style.backgroundImage = 'url(../../src/img/bg_username.jpg)';
                                _startScreen.style.boxShadow = 'none';
                                inputDiv.appendChild(logo);
                                inputDiv.appendChild(input);
                                _startScreen.appendChild(inputDiv);
                                _startScreen = $(_startScreen);
                            }, 1000); // BLACK => LOGIN
                        }, FRAME_DURATION); // 3 => BLACK
                    }, 1000); // BLACK => 3
                }, FRAME_DURATION); // 2 => BLACK
            }, 1000); // BLACK => 2
        }, FRAME_DURATION * 0.5); // 1 => BLACK
    };

    this.destroy = function () {
    };

    _init();
};