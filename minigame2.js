var canvas = document.getElementById('myCanvas2');
var context = canvas.getContext('2d');

//Object constructor voor player
function CharOne(x, y, w, h) {
    //bepaal de waardes die je wilt mee geven als je een new obj aanmaakt
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.moveRight = false;
    this.moveLeft = false;
}

//Geef dit gedrag mee aan de constructor
CharOne.prototype = {
    draw: function () {//geef de afbeelding mee
        context.fillRect(this.x, this.y, this.w, 10);
    },
    createListeners: function () {
        var that = this;
        window.addEventListener('keyup', function () {// als de pijltjes los worden gelaten zet de waardes op false
            that.moveLeft = false;
            that.moveRight = false;
        });

        window.addEventListener('keydown', function (e) {//bij keypress zet het op true om een soepelere beweging te genereren
            if (e.keyCode === 37) {
                that.moveLeft = true;
            }
            if (e.keyCode === 39) {
                that.moveRight = true;
            }
        });
    },
    left: function () {
        if (this.moveLeft) {// bij moveLeft true beweeg x positie 8 opzij
            this.x -= 4;
        }
    },
    right: function () {
        if (this.moveRight) {
            this.x += 4;
        }
    }
};

function Objects() {
    this.x = Math.random() * ((250 - 10 + 1) + 10); // genereer hier random posities tussen deze waardes
    this.y = Math.random() * ((100 - 50 + 1) + 50);
    this.size = 12;
}

Objects.prototype = {
    draw: function () {
        var obj = new Image();
        obj.src = "img/twitterbird.png";
        context.drawImage(obj, this.x, this.y, this.size, this.size);
    },
    move: function () {
        this.y += 0.6;
    },
    hitDetection: function () {
        var dx = player.x - this.x;// de positie van beide objecten
        var dy = player.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);//formule hitdetectie https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        if (distance < 10) {
            n.counterUp();
            for (var i = 0; i < birds.length; i++) {
                birds.splice(i, 1);
            }
        }
    },
    spliceBird: function () {
        if (this.y >= 600) {//als de banaan buiten het scherm is verwijder deze uit de array
            birds.splice(birds, 1);
            n.countDown();
        }
    },
    thumbs: function () {
        var obj = new Image();
        obj.src = "img/thumb.png";
        context.drawImage(obj, this.x, this.y, this.size, this.size);
    },
    thumbsMove: function () {
        this.y += 0.7;
    },
    hitDetectionthumbs: function () {
        var dx = player.x - this.x;
        var dy = player.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 10) {
            n.countDown();
            for (var i = 0; i < thumbs.length; i++) {
                thumbs.splice(i, 1);
            }
        }
    },
    splicethumbs: function () {
        if (this.y >= 600) {
            thumbs.splice(thumbs, 1);
        }
    }
};

//Counter constructor voor score en life
function Counter() {
    this.score = 0;
    this.life = 5;
}

Counter.prototype = {
    counterUp: function () { //functie aanroepen als banaan gevangen is
        var that = this;
        that.score++;
    },
    countDown: function () { // functie aanroepen als banaan gevallen is of appel is gevangen.
        var that = this;
        that.life--;
    },
    resetLife: function () {
        var that = this;
        that.life = 5;
    },
    lifeCount: function () { // draw de life count
        context.fillStyle = 'lightgreen';
        context.font = "8px Arial";
        context.fillText("Life: " + this.life, 260, 10);
    },
    scoreCount: function () { // draw de score
        context.fillStyle = 'lightgreen';
        context.font = "8px Arial";
        context.fillText("Birds: " + this.score, 10, 10);
    },
    gameScore: function() {
        context.fillStyle = 'lightgreen';
        context.font = '8px Arial';
        context.fillText('you catched: ' + this.score + ' birds', 120, 80);
    },
    resetGame: function () {
        if (this.life <= 0) {
            this.gameScore();
            clearInterval(intervalAppel); // stop intervals
            clearInterval(intervalBanaan);
        }

        if (this.score >= 12) {
            aPush.y += 0.3;
            bPush.y += 0.3;
        }
    }
};

// arrays waar de objecten naar toe gepushed worden
var birds = [];
var thumbs = [];

// update functie
function Update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();
    player.left();
    player.right();

    //geeft dit mee aan elk gepushte object
    birds.forEach(function (bird) {
        bird.draw();
        bird.move();
        bird.hitDetection();
        bird.spliceBird();
    });

    thumbs.forEach(function (thumb) {
        thumb.thumbs();
        thumb.thumbsMove();
        thumb.hitDetectionthumbs();
        thumb.splicethumbs();
    });

    n.scoreCount();
    n.lifeCount();
    n.resetGame();

    window.requestAnimationFrame(Update);
}

player = new CharOne(canvas.width / 2 - 10, canvas.height - 11, 20);
player.createListeners();

//push new object to array om de .... seconde
intervalAppel = setInterval(function () {
    thumbs.push(aPush = new Objects());
}, 3300);

intervalBanaan = setInterval(function () {
    birds.push(bPush = new Objects());
}, 3000);

var n = new Counter();

Update();

