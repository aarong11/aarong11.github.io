function runScripts(data, pos) {
        var prompt = $('.prompt'),
                script = data[pos];
        if (script.clear === true) {
                $('.history').html('');
        }
        switch (script.action) {
                case 'unlockui':
                        var json = {
                                type: "unlock",
                                data: "",
                                sound: ""
                        };
                        addWindowMessage(json);
                        break;
                case 'lockui': 
                        var json = {
                                type: "lock",
                                data: "",
                                sound: ""
                        };
                        addWindowMessage(json);
                        break;
                case 'setanswerbuttontext':
                        var json = {
                                type: "setanswerbuttontext",
                                data: script.data
                        }
                        addWindowMessage(json);
                        console.log(json);
                        break;
                case 'type':
                        // cleanup for next execution
                        prompt.removeData();
                        $('.typed-cursor').text('');
                        if (script.script) {
                                addWindowMessage(script.script);
                        }
                        prompt.typed({
                                strings: script.strings,
                                typeSpeed: 30,
                                callback: function () {
                                        var history = $('.history').html();
                                        history = history ? [history] : [];
                                        history.push(prompt.text());
                                        if (script.output) {
                                                history.push(script.output);
                                                prompt.html('');
                                                $('.history').html(history.join('<br>'));
                                        }
                                        // scroll to bottom of screen
                                        $('section.terminal').scrollTop($('section.terminal').height());
                                        // Run next script
                                        pos++;
                                        if (pos < data.length) {
                                                setTimeout(function () {
                                                        runScripts(data, pos);
                                                }, script.postDelay || 1000);
                                        }
                                }
                        });
                        break;
                case 'unlock':
                        console.log("test");
                        isKeyboardUnlocked = true;
                        break;
                case 'done':
                        return;
                case 'view':

                        break;
        }
}

function isUnlocked() {
        return isKeyboardUnlocked;
}

function getWindowMessages() {
        return JSON.stringify({ scripts: windowMessages });
        //windowMessages = [];
}

function addWindowMessage(message) {
        windowMessages.push(message);
}



const GameEventsEnum = Object.freeze({ "ClickButtonEvent": 1 })

function gameEventFired(e) {

        addWindowMessage({
                "type": "playSound",
                "sound": "button_click"
        });
}

