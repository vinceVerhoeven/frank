// ModelFrank eigenschappen en logica van Frank
function ModelFrank() {
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.text = "";
    this.soundStartup = new Audio();
    this.soundStartup.src = 'sounds/startup.wav';
    this.soundStartup.volume = 0.2;
}
ModelFrank.prototype = {
    talk: function (text) {
        var splitstr = text.split('');
        var i = 0;
        var self = this;
        var inter = setInterval(function () {
            if (i < splitstr.length) {
                self.text += splitstr[i];
            }
            i++;
            if (i > splitstr.length) {
                self.textAvailable = true;
                self.text = '';
                i = 0;
                clearTimeout(inter);
            }
        }, 200);
    },
    displayText: function () {
        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = 'lightgreen';
        this.ctx.fillText(this.text, 10, 50);
    }
};
// eigenschappen en logica van de speler
function ModelPlayer() {
    // met de verschillende types reply kunnen wij de gebruiker beinvloeden
    this.replies = {
        startup1: {
            normal: "I am .....",
            shy: "stay silent",
            mean: "what do you care?"
        },
        startup2: {
            normal: "",
            shy: "",
            mean: ""
        },
        startup3: {
            normal: "",
            shy: "",
            mean: ""
        }
    }
}
ModelPlayer.prototype = {
};
// ModelGame eigenschappen en logica van Game volgorde
function ModelGame(parent) {
    this.parent = parent;
}
ModelGame.prototype = {
    start: function () {
        var self = this;
        console.info('start game');
        this.parent.modelFrank.soundStartup.play();
        setTimeout(function () {
            self.parent.modelFrank.talk('hello? I am frank who are you?');
        }, 5000);
    }
};
// Controller verbind models en views
function Controller() {
    this.modelFrank = new ModelFrank();
    this.ModelGame = new ModelGame(this);
    this.ModelGame.start('hello who are you?');
}
Controller.prototype = {
    update: function () {
        var self = this;
        this.modelFrank.displayText();
        window.requestAnimationFrame(function () {
            self.update();
        });
    }
};
setTimeout(function () {
    var controller = new Controller();
    controller.update();
}, 1000);