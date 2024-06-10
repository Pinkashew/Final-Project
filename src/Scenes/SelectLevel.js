class SelectLevel extends Phaser.Scene {
    constructor() {
        super("selectLevel");
    }

    preload() {

    }

    create() {
        let my = this.my;
        this.nextScene = this.input.keyboard.addKey("S");
        this.test = this.input.keyboard.addKey("L");
        let levelText = this.add.text(game.config.width/2, game.config.height/2 - 100, "LEVEL ONE: Seasons of Change", {fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6'});
        let start = this.add.text(game.config.width/2, game.config.height/2, "Press S to begin level!", { fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6' });
        levelText.setOrigin(0.5, 0.5);
        start.setOrigin(0.5, 0.5);
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("loadScene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.test)) {
            this.scene.start("winnerLevel");
        }
      
    }
}