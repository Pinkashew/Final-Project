class Controls extends Phaser.Scene {
    constructor() {
        super("controls");
    }

    preload() {

    }

    create() {
        let my = this.my;
        let controls = this.add.text(game.config.width/2, game.config.height/2 - 120, "CONTROLS", { fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6' });
        let start = this.add.text(game.config.width/2, game.config.height/2 - 40, "Use LEFT arrow key to move left", { fontFamily: "'Roboto'", fontSize: '32px', fill: '#ADD8E6' });
        let start1 = this.add.text(game.config.width/2, game.config.height/2, "Use RIGHT arrow key to move right", { fontFamily: "'Roboto'", fontSize: '32px', fill: '#ADD8E6' });
        let start2 = this.add.text(game.config.width/2, game.config.height/2 + 40, "Use UP arrow key to jump", { fontFamily: "'Roboto'", fontSize: '32px', fill: '#ADD8E6' });
        let start3 = this.add.text(game.config.width/2, game.config.height/2 + 80, "Collect coins along the way", { fontFamily: "'Roboto'", fontSize: '32px', fill: '#ADD8E6' });
        let start4 = this.add.text(game.config.width/2, game.config.height/2 + 120, "If you fall into spikes you will die and respawn at the beginning", { fontFamily: "'Roboto'", fontSize: '32px', fill: '#ADD8E6' });
        let start6 = this.add.text(game.config.width/2, game.config.height/2 + 160, "In Level 3, if you see a door you have a 50/50 to get sent back to the bottom or win!!!", { fontFamily: "'Roboto'", fontSize: '32px', fill: '#ADD8E6' });
        let start5 = this.add.text(game.config.width/2, game.config.height/2 + 240, "Press S to go back to Main Menu", { fontFamily: "'Roboto'", fontSize: '48px', fill: '#ADD8E6' });
        controls.setOrigin(0.5, 0.5);
        start.setOrigin(0.5, 0.5);
        start1.setOrigin(0.5, 0.5);
        start2.setOrigin(0.5, 0.5);
        start3.setOrigin(0.5, 0.5);
        start4.setOrigin(0.5, 0.5);
        start5.setOrigin(0.5, 0.5);
        start6.setOrigin(0.5, 0.5);
        this.nextScene = this.input.keyboard.addKey("S");
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("titleScreen");
        }
    }
}