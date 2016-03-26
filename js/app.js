// ModelFrank eigenschappen en logica van Frank
function ModelFrank() {
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    // computer regeert anders gebasseerd op aantal punten
    this.dialog = {
        1: {
            normal: {frankSay: "this dialog 1", points: 0,
                userinput: {
                    normal: {userSay: "1. normal answer", points: 2, button: 49},
                    shy: {userSay: "2. shy answer", points: 3, button: 50},
                    mean: {userSay: "3. mean answer", points: 1, button: 51}
                }
            }
        },
        2: {
            normal: {frankSay: "this dialog 1", points: 0,
                userinput: {
                    normal: {userSay: "1. normal answer", points: 2, button: 49},
                    mean: {userSay: "3. mean answer", points: 1, button: 51},
                    shy: {userSay: "2. shy answer", points: 3, button: 50}
                }
            }
        },
        3: {
            normal: {frankSay: "this dialog 1", points: 0,
                userinput: {
                    normal: {userSay: "1. normal answer", points: 2, button: 49},
                    mean: {userSay: "3. mean answer", points: 1, button: 51},
                    shy: {userSay: "2. shy answer", points: 3, button: 50}
                }
            }
        },
        4: {
            normal: {frankSay: "this dialog 1", points: 0,
                userinput: {
                    normal: {userSay: "1. normal answer", points: 2, button: 49},
                    mean: {userSay: "3. mean answer", points: 1, button: 51},
                    shy: {userSay: "2. shy answer", points: 3, button: 50}
                }
            }
        }

    };
    this.answers = ['normal', 'shy', 'mean'];

    this.frankText = "";
    this.userText = "";
    this.dialogNumber = 0;


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
    dialogConverter: function () {
        this.dialogNumber += 1;
        return  this.dialog[this.dialogNumber]['normal']['frankSay'];
    },
    talk: function () {
        if (!this.talking) {
            this.talking = true;
            this.displayUserText = false;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.userText = "";
            this.frankText = "";
            console.info('frank talking');
            var text = this.dialogConverter();
            var splitstr = text.split('');
            var i = 0;
            var pause = 200;
            var self = this;
            var currentTime = new Date().getTime();
            var inter = setInterval(function () {
                // maakt frank meer natuurlijk
                if (currentTime + pause < new Date().getTime()) {
                    if (i < splitstr.length) {
                        currentTime = new Date().getTime();
                        pause = self.randomNumber(20, 200);
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
            }, 200);
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
                    var text = this.dialog[this.dialogNumber]['normal']['userinput'][answer]['userSay'];
                    this.ctx.fillText(text, 30, textPosition);
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
    this.buttonPressed = null;
    // userfeed is om de de gebruikers feedback te onthouden
    this.userfeed = [];
}
ModelPlayer.prototype = {
    keyboard: function () {
        // alles wat te maken heeft met de keyboard komt hier
        var self = this;
        window.addEventListener('keydown', function (e) {
            if (e.keyCode === 49 || e.keyCode === 50 || e.keyCode === 51) {
                self.buttonPressed = e.keyCode || e.which;
                self.scanButtonPressedDialog();
                self.parent.modelFrank.talk();
            }
        });
    },
    scanButtonPressedDialog: function () {

        if (!this.parent.modelFrank.talking) {
            var emotion, dialogNumber = this.parent.modelFrank.dialogNumber;
            for (var i = 0; i < 3; i++) {
                var emotion = this.parent.modelFrank.answers[i];
                var buttonWithAnswer = this.parent.modelFrank.dialog[dialogNumber]['normal']['userinput'][emotion]['button'];
                if (buttonWithAnswer === this.buttonPressed) {
                    this.saveInUserFeed(this.parent.modelFrank.dialog[dialogNumber]['normal']['userinput'][emotion]);
                }
            }
        }
    },
    saveInUserFeed: function (userDialogObject) {
        this.userfeed.push(userDialogObject);
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
    start: function () {
        var self = this;
        console.info('start game');
        // this.parent.modelFrank.soundStartup.play();

        self.parent.modelPlayer.keyboard();
        self.parent.modelFrank.displayTextOn();
        self.parent.modelFrank.talk();
    }
};
// Controller verbind models en views
function Controller() {
    this.modelFrank = new ModelFrank();
    this.modelPlayer = new ModelPlayer(this);
    this.modelGame = new ModelGame(this);
    this.modelGame.start();
}
Controller.prototype = {
    update: function () {
        var self = this;
        this.modelFrank.displayTextOnScreen();
        window.requestAnimationFrame(function () {
            self.update();
        });
    }
};
setTimeout(function () {
    var controller = new Controller();
    controller.update();
}, 1000);