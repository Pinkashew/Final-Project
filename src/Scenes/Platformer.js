class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
        this.respawn = this.respawn.bind(this);
        this.winner = this.winner.bind(this);
        this.secret = this.secret.bind(this);
        this.handlePlatformDisappearance = this.handlePlatformDisappearance.bind(this);
        this.secretFlag = this.secretFlag.bind(this);
    }

    init() {
        // variables and settings
        this.ACCELERATION = 300;
        this.MAX_X_VEL = 200
        this.MAX_Y_VEL = 2000
        this.DRAG = 2000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 2000;
        this.JUMP_VELOCITY = -750;
        
    }

    respawn() {
        const p1Spawn = this.map.findObject("Objects", obj => obj.name === "SpawnPoint")
        my.sprite.player.body.x = p1Spawn.x;
        my.sprite.player.body.y = p1Spawn.y - 50;
    }

    winner() {
        this.scene.start("winnerLevel");
    }

    secret() {
        this.doorSound.play();
        const secretSpawn = this.map.findObject("Objects", obj => obj.name === "SpawnPoint2")
        my.sprite.player.body.x = secretSpawn.x;
        my.sprite.player.body.y = secretSpawn.y - 50;
    }

    handlePlatformDisappearance(player, platform) {
        this.time.delayedCall(1000, () => {
            platform.setCollision(false, false, false, false);
            platform.setVisible(false);
        });
    }

    secretFlag() {
        this.scene.start("secretWinner");
    }

    create() {
        this.physics.world.setBounds(0,0, 18 * 120, 40 * 18);
        this.cameras.main.setBounds(0, 0, 18 * 120, 40 * 18);
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level", 18, 18, 120, 40);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.background = this.map.addTilesetImage("PixelBackground", "tilemap_background");

        // Create a layer
        this.backgroundLayer = this.map.createLayer("Background", this.background, 0, 0);
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.grassLayer = this.map.createLayer("Grass-n-Bushes", this.tileset, 0, 0);
        this.spikes = this.map.createLayer("Spikes", this.tileset, 0, 0);
        this.winnerLayer = this.map.createLayer("Winner", this.tileset, 0, 0);
        this.secretLayer = this.map.createLayer("Door", this. tileset, 0, 0);
        this.disappearingPlatforms = this.map.createLayer("DisappearingPlatforms", this.tileset, 0, 0);
        this.secretWinner = this.map.createLayer("Secret", this.tileset, 0, 0);

        this.coinSound = this.sound.add('coinCollect');
        this.doorSound = this.sound.add('doorOpen');

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true,
        });
        this.grassLayer.setCollisionByProperty({
            collides: true,
        });
        this.spikes.setCollisionByProperty({
            death: true,
        });
        this.winnerLayer.setCollisionByProperty({
            collides: true,
        });
        this.secretLayer.setCollisionByProperty({
            collides: true,
        });
        this.disappearingPlatforms.setCollisionByProperty({
            disappears: true,
        });
        this.secretWinner.setCollisionByProperty({
            collides: true,
        });


        const p1Spawn = this.map.findObject("Objects", obj => obj.name === "SpawnPoint")
        my.sprite.player = this.physics.add.sprite(p1Spawn.x, p1Spawn.y, "platformer_characters", "tile_0000.png").setScale(1)
        // set player physics properties
        my.sprite.player.setCollideWorldBounds(true)

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.grassLayer);
        this.physics.add.collider(my.sprite.player, this.winnerLayer, this.winner);
        this.physics.add.collider(my.sprite.player, this.spikes, this.respawn);
        this.physics.add.collider(my.sprite.player, this.secretLayer, this.secret);
        this.physics.add.collider(my.sprite.player, this.disappearingPlatforms, this.handlePlatformDisappearance);
        this.physics.add.collider(my.sprite.player, this.secretWinner, this.secretFlag);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // movement vfx

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_01.png', 'smoke_03.png'],
            // TODO: Try: add random: true
            scale: {start: 0.09, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });
        
        my.vfx.walking.stop();

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_06.png', 'smoke_10.png'],
            // TODO: Try: add random: true
            scale: {start: 0.06, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });
        
        my.vfx.jumping.stop();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(2);

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.coinSound.play();
            obj2.destroy(); // remove coin on overlap
        });

        this.nextScene = this.input.keyboard.addKey("R");
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("loadScene");
        }
        
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2+1, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }
        } 
        
        else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-22, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2, false);
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jumping.start();
        }
        else if (my.sprite.player.body.blocked.down) {
            my.vfx.jumping.stop();
        }
    }
}