class TitleScreen extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    preload() {

    }

    create() {
        let my = this.my;
        let start = this.add.text(game.config.width/2, game.config.height/2, "Press S to Start Game!!!", { fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6' });
        let titleCard = this.add.text(game.config.width/2, game.config.height/2 - 100, "Adventures of Squiggles", { fontFamily: "'Roboto'", fontSize: '80px', fill: '#ADD8E6' });
        let controlCard = this.add.text(game.config.width/2, game.config.height/2 + 100, "Press C to look at controls and how to play", { fontFamily: "'Roboto'", fontSize: '48px', fill: '#ADD8E6' });
        start.setOrigin(0.5, 0.5);
        titleCard.setOrigin(0.5, 0.5);
        controlCard.setOrigin(0.5, 0.5);
        this.nextScene = this.input.keyboard.addKey("S");
        this.controlScene = this.input.keyboard.addKey("C");
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("selectLevel");
        }
        if (Phaser.Input.Keyboard.JustDown(this.controlScene)) {
            this.scene.start("controls");
        }
    }
}