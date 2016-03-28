
function ModelMiniGame1(parent) {
    this.parent = parent;
    this.ctx = this.parent.modelFrank.ctx;
    this.score = 0;

    this.yPos = 50;
    this.xPos = 100;
    this.width = 10;
    this.height = 10;
    this.speed = 2;


    this.meImage = new Image();
    this.meImage.src = 'images/8bitme.png';
    this.thumbImage = new Image();
    this.thumbImage.src = 'images/thumb.png';

    this.timeScore = 3000; // miliseconds
    this.thumbs = [];
    this.thumbMaxSpeed = 2;
    this.thumbX = this.parent.modelFrank.canvas.width + 40;
    this.adder = 10;
    this.startAutoScore = false;
    this.addThumb();
}
ModelMiniGame1.prototype = {
    interface: function () {
        this.ctx.font = "8px Arial";
        this.ctx.fillStyle = 'lightgreen';
        this.ctx.fillText("use arrow up & arrow down", 10, 140);
    },
    gameFlow: function () {
        if (this.score === 10)
            this.addThumb();
        if (this.score === 30) {
            this.addThumb();
            this.addMoreSpeedThumb();
        }
        if (this.score === 50)
            this.addThumb();
        if (this.score === 60) {
            this.addThumb();
            this.addMoreSpeedThumb();
        }
        if (this.score > 80) {
            this.startAutoScore = true;
        }
    },
    moving: function () {
        if (this.parent.modelPlayer.keyState[38] && this.yPos > 10) { // omhoog
            this.yPos -= this.speed;
        }
        if (this.parent.modelPlayer.keyState[40] && this.yPos < 120) { // omlaag
            this.yPos += this.speed;
        }
    },
    automaticScore: function () {
        if (this.startAutoScore) {
            this.score += this.adder;
        }
    },
    renderThumbs: function () {
        for (var i = 0; i < this.thumbs.length; i++) {
            this.drawThumb(i);
            this.moveThumb(i);
            this.wallsThumb(i);
            this.hitDetection(i);
        }
    },
    wallsThumb: function (i) {
        if (this.thumbs[i].thumbX < -40) {
            this.thumbs[i].speed = this.parent.modelFrank.randomNumber(0.1, this.thumbMaxSpeed);
            this.thumbs[i].thumbY = this.parent.modelFrank.randomNumber(0, 130);
            this.thumbs[i].thumbX = this.parent.modelFrank.canvas.width + 50;
        }
    },
    displayScore: function () {
        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = 'lightgreen';
        this.ctx.fillText("score " + this.score, 15, 20);
    },
    addThumb: function () {
        var speed = this.parent.modelFrank.randomNumber(0.1, this.thumbMaxSpeed);
        var thumbY = this.parent.modelFrank.randomNumber(0, 130);
        var x = this.parent.modelFrank.canvas.width + 50;
        this.thumbs.push({thumbX: x, thumbY: thumbY, speed: speed, width: 20, height: 20});
    },
    removeThumb: function (i) {
        this.thumbs.splice(i, 1);
    },
    moveThumb: function (i) {
        this.thumbs[i].thumbX -= this.thumbs[i].speed;
    },
    addMoreSpeedThumb: function () {
        this.thumbMaxSpeed += 1;
    },
    drawThumb: function (i) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "lightgreen";
        this.ctx.drawImage(this.thumbImage, this.thumbs[i].thumbX, this.thumbs[i].thumbY, 20, 20);
        this.ctx.stroke();
    },
    hitDetection: function (i) {
        if (this.xPos + this.width >= this.thumbs[i].thumbX && this.xPos <= this.thumbs[i].thumbX + this.thumbs[i].width
                && this.yPos + this.height >= this.thumbs[i].thumbY && this.yPos <= this.thumbs[i].thumbY + this.thumbs[i].height) {
            this.score += 10;
            this.removeThumb(i);
            this.addThumb(i);
            var self = this;
            setTimeout(function () {
                self.gameFlow();
            }, 1500);
        }
    },
    drawCharacter: function () {
        this.parent.modelFrank.clearScreen();
        this.ctx.beginPath();
        this.ctx.fillStyle = "lightgreen";
        this.ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
        this.ctx.stroke();
    },
    updateMiniGame1: function () {
        if (this.parent.modelFrank.miniGame1Active) {
            this.moving();
            this.drawCharacter();
            //  this.addScore();
            this.displayScore();
            this.renderThumbs();
            this.automaticScore();
            this.interface();
        }
    }
};
