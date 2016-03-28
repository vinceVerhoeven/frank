// ModelFrank eigenschappen en logica van Frank
function ModelFrank(parent) {
    this.parent = parent;
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.dialogActive = true;
    this.miniGame1Active = false;
    // computer regeert anders gebasseerd op aantal punten
    this.dialog = {
        1: {
            normal: {frankSay: "Hello, It’s good to have you finally here!", points: 0,
                userinput: {
                    normal: {userSay: "1. Yep", points: 2, button: 49},
                    shy: {userSay: "2. Wait, who are you?", points: 3, button: 50},
                    mean: {userSay: "3. stay silent.", points: 1, button: 51}
                },
                answer: {
                    normal: {frankSay: "1. Is that all you answer? I shall reintroduce myself"},
                    shy: {frankSay: "2. Who am I? haha"},
                    mean: {frankSay: "3. not a talker I see"}
                }
            }
        },
        2: {
            normal: {frankSay: "I am frank the old computer. Can you not see that?", points: 0,
                userinput: {
                    normal: {userSay: "1. No I don’t", points: 2, button: 49},
                    mean: {userSay: "3. Yes, you look like shit.", points: 1, button: 51},
                    shy: {userSay: "2. stay silent.", points: 3, button: 50}
                }
            }
        },
        3: {
            normal: {frankSay: "Anyway, I have been waiting for you for a long time", points: 0,
                userinput: {
                    normal: {userSay: "1. Why?", points: 2, button: 49},
                    mean: {userSay: "3. Yes so am I !", points: 1, button: 51},
                    shy: {userSay: "2. You are freaking me out", points: 3, button: 50}
                }
            }
        },
        4: {
            normal: {frankSay: "do you want to play a game?", points: 0,
                userinput: {
                    normal: {userSay: "1. No I have work to do", points: 2, button: 49},
                    mean: {userSay: "3. log out", points: 1, button: 51},
                    shy: {userSay: "2. shut the computer off", points: 3, button: 50}
                }
            }
        },
        5: {
            normal: {frankSay: "I want you to play a game with me", points: 0,
                userinput: {
                    normal: {userSay: "1. okay", points: 2, button: 49},
                    mean: {userSay: "3. okay", points: 1, button: 51},
                    shy: {userSay: "2. okay", points: 3, button: 50}
                }
            }
        },
        6: {
            normal: {frankSay: "you cannot leave me", points: 0,
                userinput: {
                    normal: {userSay: "1. ", points: 2, button: 49},
                    mean: {userSay: "3. ", points: 1, button: 51},
                    shy: {userSay: "2. ", points: 3, button: 50}
                }
            }
        }
    };
    this.answers = ['normal', 'shy', 'mean'];
    this.frankText = "";
    this.userText = "";
    this.dialogNumber = 0;
    this.showLastAnswer = false;
    this.displayText = false;
    this.displayUserText = false;
    this.soundStartup = new Audio();
    this.soundStartup.src = 'sounds/startup.wav';
    this.soundStartup.volume = 0.2;
}
ModelFrank.prototype = {
    randomNumber: function (max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    inputIcon: function () {
        this.displayText(100, 100, "check");
    },
    clearScreen: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    checkDisplayAnswerOnly: function () {
        if (this.dialog[this.dialogNumber]['normal']['answer'] && this.parent.modelPlayer.lastemotion) {
            var emotion = this.parent.modelPlayer.lastemotion;
            this.frankSplitText = this.dialog[this.dialogNumber]['answer'][emotion]['frankSay'];
            return true;
        } else {
            this.frankSplitText = this.dialog[this.dialogNumber]['normal']['frankSay'];
            return false;
        }
    },
    talk: function () {
        if (!this.talking) {
            this.talking = true;
            this.displayUserText = false;
            this.clearScreen();
            this.userText = "";
            this.frankText = "";
            console.info(this.frankSplitText);
            var splitstr = this.frankSplitText.split('');
            var i = 0;
            var pause = 200;
            var self = this;
            var currentTime = new Date().getTime();
            var inter = setInterval(function () {
                // maakt frank meer natuurlijk door inconistent te typen
                if (currentTime + pause < new Date().getTime()) {
                    if (i < splitstr.length) {
                        currentTime = new Date().getTime();
                        pause = self.randomNumber(20, 40);
                        self.frankText += splitstr[i];
                    }
                    i++;
                    if (i > splitstr.length) {
                        // display user text
                        self.displayUserText = true;
                        self.talking = false;
                        i = 0;
                        clearTimeout(inter);
                    }
                }
            }, 100);
        }
    },
    displayLastAnswer: function () {
        if (!this.talking && !this.showLastAnswer) {
            var self = this;
            this.clearScreen();
            this.showLastAnswer = true;
            setTimeout(function () {
                self.dialogNumber += 1; // add one to dialog number
                self.showLastAnswer = false;
                if (self.checkDisplayAnswerOnly()) {

                } else {
                    self.talk();
                }
            }, 1000);
        }
    },
    displayTextOnScreen: function () {
        if (this.displayText) {
            this.ctx.font = "12px Arial";
            this.ctx.fillStyle = 'lightgreen';
            this.ctx.fillText(this.frankText, 10, 30);
            if (this.displayUserText) {
                var textPosition = 40;
                for (var i = 0; i < 3; i++) {
                    textPosition += 15;
                    var answer = this.answers[i];
                    // laatste answer blijft even staan
                    if (this.showLastAnswer && this.parent.modelPlayer.lastemotion === answer) {
                        var text = this.dialog[this.dialogNumber]['normal']['userinput'][answer]['userSay'];
                        this.ctx.fillText(text, 30, textPosition);
                    }

                    if (!this.showLastAnswer) {
                        var text = this.dialog[this.dialogNumber]['normal']['userinput'][answer]['userSay'];
                        this.ctx.fillText(text, 30, textPosition);
                    }

                    if (i === 3) {
                        textPosition = 40;
                    }
                }
            }
        }
    },
    displayTextOn: function () {
        this.displayText = true;
    },
    displayTextOff: function () {
        this.displayText = false;
    }
};
// eigenschappen en logica van de speler
function ModelPlayer(parent) {
    // met de verschillende types reply kunnen wij de gebruiker beinvloeden
    this.parent = parent;
    this.name = "";
    this.lastemotion = "";
    this.buttonPressed = null;
    // userfeed is om de de gebruikers feedback te onthouden
    this.userfeed = [];
    this.keyboard();
}
ModelPlayer.prototype = {
    keyboard: function () {
// alles wat te maken heeft met de keyboard komt hier
        var self = this;
        this.keyState = {};
        window.addEventListener('keydown', function (e) {
            if (self.parent.modelFrank.dialogActive) {
                if (e.keyCode === 49 || e.keyCode === 50 || e.keyCode === 51) {
                    self.buttonPressed = e.keyCode || e.which;
                    self.scanButtonPressedDialog();
                    // self.displayLastAnswer
                }
            }
            if (self.parent.modelFrank.miniGame1Active) {
                self.keyState[e.keyCode || e.which] = true;
            }
        });
        window.addEventListener('keyup', function (e) {
            self.keyState[e.keyCode || e.which] = false;
        });
    },
    scanButtonPressedDialog: function () {

        if (!this.parent.modelFrank.talking && !this.parent.modelFrank.showLastAnswer) {
            var emotion, dialogNumber = this.parent.modelFrank.dialogNumber;
            for (var i = 0; i < 3; i++) {
                var emotion = this.parent.modelFrank.answers[i];
                var buttonWithAnswer = this.parent.modelFrank.dialog[dialogNumber]['normal']['userinput'][emotion]['button'];
                if (buttonWithAnswer === this.buttonPressed) {
                    this.lastemotion = emotion;
                    this.saveInUserFeed(this.parent.modelFrank.dialog[dialogNumber]['normal']['userinput'][emotion]);
                }
            }
        }
    },
    saveInUserFeed: function (userDialogObject) {
        this.userfeed.push(userDialogObject);
        this.parent.modelFrank.displayLastAnswer();
        for (var i = 0; i < this.userfeed.length; i++) {
            console.info(this.userfeed[i]);
        }
    }
};
// ModelGame eigenschappen en logica van Game volgorde
function ModelGame(parent) {
    this.parent = parent;
}
ModelGame.prototype = {
    gameFlow: function () {
        if (this.parent.modelFrank.dialogNumber > 5 && !this.fase1) {
            this.fase1 = true;
            this.parent.modelFrank.dialogActive = false;
            this.parent.modelFrank.miniGame1Active = true;
            console.warn('start mini game!');
        }
        if (this.parent.modelMiniGame1.score > 1000 && !this.fase2) {
            this.fase2 = true;
            this.parent.modelFrank.clearScreen();
            this.parent.modelFrank.dialogActive = true;
            this.parent.modelFrank.miniGame1Active = false;
        }

    },
    start: function () {
        var self = this;
        console.info('start game');
        this.parent.modelFrank.soundStartup.play();
        self.parent.modelFrank.displayTextOn();
        self.parent.modelFrank.displayLastAnswer();
    }
};
// Controller verbind models en views
function Controller() {
    this.modelFrank = new ModelFrank(this);
    this.modelGame = new ModelGame(this);
    this.modelPlayer = new ModelPlayer(this);
    this.modelMiniGame1 = new ModelMiniGame1(this);
    this.modelGame.start();
}
Controller.prototype = {
    update: function () {
        var self = this;
        this.modelGame.gameFlow();
        this.modelFrank.displayTextOnScreen();
        this.modelMiniGame1.updateMiniGame1();
        window.requestAnimationFrame(function () {
            self.update();
        });
    }
};
setTimeout(function () {
    var controller = new Controller();
    controller.update();
}, 1000);