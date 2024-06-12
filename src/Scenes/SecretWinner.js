class SecretWinner extends Phaser.Scene {
    constructor() {
        super("secretWinner");
    }

    preload() {

    }

    create() {
        let my = this.my;
        this.add.image(game.config.width/2, game.config.height/2, 'cat');
        let cat = this.add.text(game.config.width/2, game.config.height/2 - 200, "YOU FOUND SECRET CAT HORRAY!", {fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6'});
        let cats = this.add.text(game.config.width/2, game.config.height/2 + 300, "Press R to go back to Level 1", {fontFamily: "'Roboto'", fontSize: '64px', fill: '#ADD8E6'});
        this.nextScene = this.input.keyboard.addKey("S");
        cat.setOrigin(0.5, 0.5);
        cats.setOrigin(0.5, 0.5);
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("platformerScene");
        }
    }
}