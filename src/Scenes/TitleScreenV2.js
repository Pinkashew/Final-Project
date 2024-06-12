class TitleScreenV2 extends Phaser.Scene {
    constructor() {
        super("titleScreenV2");
    }

    preload() {

    }

    create() {
        let my = this.my;
        let start = this.add.text(game.config.width/2, game.config.height/2 + 100, "Press Q to Play Level 1", { fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6' });
        let start1 = this.add.text(game.config.width/2, game.config.height/2 + 200, "Press W to Play Level 2", { fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6' });
        let start2 = this.add.text(game.config.width/2, game.config.height/2 + 300, "Press E to Play Level 3", { fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6' });
        let titleCard = this.add.text(game.config.width/2, game.config.height/2 - 100, "Adventures of Squiggles", { fontFamily: "'Roboto'", fontSize: '80px', fill: '#ADD8E6' });
        let controlCard = this.add.text(game.config.width/2, game.config.height/2, "Press C to look at controls and how to play", { fontFamily: "'Roboto'", fontSize: '48px', fill: '#ADD8E6' });
        start.setOrigin(0.5, 0.5);
        start1.setOrigin(0.5, 0.5);
        start2.setOrigin(0.5, 0.5);
        titleCard.setOrigin(0.5, 0.5);
        controlCard.setOrigin(0.5, 0.5);
        this.nextScene = this.input.keyboard.addKey("S");
        this.controlScene = this.input.keyboard.addKey("C");
        this.level1 = this.input.keyboard.addKey("Q");
        this.level2 = this.input.keyboard.addKey("W");
        this.level3 = this.input.keyboard.addKey("E");
    }

    update() {
        let my = this.my;
        
        if (Phaser.Input.Keyboard.JustDown(this.controlScene)) {
            this.scene.start("controls");
        }

        if (Phaser.Input.Keyboard.JustDown(this.level1)) {
            this.scene.start("platformerScene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.level2)) {
            this.scene.start("nextLevel");
        }

        if (Phaser.Input.Keyboard.JustDown(this.level3)) {
            this.scene.start("jumpLevel");
        }
    }
}