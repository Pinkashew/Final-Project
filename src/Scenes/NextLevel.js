class NextLevel extends Phaser.Scene {
    constructor() {
        super("nextLevel");
        this.respawn = this.respawn.bind(this);
    }

    init() {
        // variables and settings
        this.ACCELERATION = 200;
        this.MAX_X_VEL = 50;
        this.MAX_Y_VEL = 2000;
        this.DRAG = 2000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 2000;
        this.JUMP_VELOCITY = -550;
    }

    respawn() {
        const p1Spawn = this.map.findObject("Objects", obj => obj.name === "SpawnPoint")
        my.sprite.player.body.x = p1Spawn.x;
        my.sprite.player.body.y = p1Spawn.y - 50;
    }

    create() {
        this.physics.world.setBounds(0,0, 18 * 960, 40 * 18);
        this.cameras.main.setBounds(0, 0, 18 * 960, 40 * 18);

        this.map = this.add.tilemap("platformer-level-1", 18, 18, 240, 20);

        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.background = this.map.addTilesetImage("tilemap-backgrounds_packed", "tilemap_background");

        this.backgroundLayer = this.map.createLayer("Background", this.background, 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.grassLayer = this.map.createLayer("Background-plants", this.tileset, 0, 0);
        this.spikes = this.map.createLayer("Spike", this.tileset, 0, 0);

        this.groundLayer.setCollisionByProperty({
            collides: true,
        });
        this.spikes.setCollisionByProperty({
            death: true,
        });

        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        const p1Spawn = this.map.findObject("Objects", obj => obj.name === "SpawnPoint")
        my.sprite.player = this.physics.add.sprite(p1Spawn.x, p1Spawn.y, "platformer_characters", "tile_0000.png").setScale(1)
        // set player physics properties
        my.sprite.player.setCollideWorldBounds(true)

        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.spikes, this.respawn);

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
    }

    update() {
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