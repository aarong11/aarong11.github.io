var isTyping = false;

function runScripts(data, pos) {
        var prompt = $('.prompt'),
                script = data[pos];
        if (script && script.clear === true) {
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
                case 'setachievements':
                        try {
                                var json = {
                                        type: "setachievements",
                                        data: script.data
                                }
                                addWindowMessage(json);
                                console.log(json);
                        } catch(ex) {
                                console.log(ex);
                        }
                        break;
                case 'setgamestatevalues':
                        try {
                                var json = {
                                        type: "setgamestatevalues",
                                        data: script.data
                                }
                                addWindowMessage(json);
                                console.log(json);
                        } catch(ex) {
                                console.log(ex);
                        }
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
                        isTyping = true;
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
                                        if (pos < data.length) {
                                                setTimeout(function () {
                                                        pos++;
                                                        isTyping = false;
                                                        runScripts(data, pos);
                                                }, script.postDelay || 1000);
                                        }
                                }
                        });
                        break;
                case 'unlock':
                        isKeyboardUnlocked = true;
                        break;
                case 'done':
                        break;
                case 'view':
                        break;
        }

        if(script.action != "typing" && !isTyping && pos < data.length) {
                pos++;
                runScripts(data, pos);
        }
}

function setAchievements(achievements) {
        try {
                var json = {
                        type: "setachievements",
                        data: achievements
                }
                addWindowMessage(json);
                console.log(json);
        } catch(ex) {
                console.log(ex);
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


function setGameStates(gameStates) {
        var json = {
                type: "setgamestatevalues",
                data: gameStates
        }

        addWindowMessage(json);
}

function lockUI() {
        var json = {
                type: "lock",
                data: "",
                sound: ""
        };
        addWindowMessage(json);
}

function playSound(sound) {
        
        var json = {
                type: "playSound",
                data: "",
                sound: sound
        };

        addWindowMessage(json);
}

function changeURL(url) {
        window.location.href = url;
}



const GameEventsEnum = Object.freeze({ CLICK_BUTTON_EVENT: 1 })

