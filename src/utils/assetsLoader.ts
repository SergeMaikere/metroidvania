import { K } from '../kaplayctx'

const loadSprites = () => {
	K.loadSprite(
		'player',
		'sprites/u.png',
		{
			sliceX: 8,
			sliceY: 9,
			anims: {
				idle: {from: 0, to: 7, loop: true},
				run: {from: 8, to: 13, loop: true},
				jump: 51,
				fall: 54,
				explode: {from: 64, to: 69, loop: true},
				attack: {from: 24, to: 28, speed: 16}
			}
		}
	)

	K.loadSprite(
		'drone',
		'sprites/dr0ne.png',
		{
			sliceX: 6,
			sliceY: 3,
			anims: {
				flying: { from: 0, to: 3, loop: true },
			    attack: { from: 6, to: 11, loop: true },
			    explode: { from: 12, to: 17 }
			}
		}
	)

	K.loadSprite(
		'burner',
		'sprites/burn3r.png',
		{
			sliceX: 5,
			sliceY: 6,
			anims: {
				idle: { from: 0, to: 3, loop: true },
			    run: { from: 6, to: 8, loop: true },
			    openfire: { from: 10, to: 14 },
			    fire: { from: 15, to: 18, loop: true },
			    shutfire: { from: 20, to: 23 },
			    explode: { from: 25, to: 29 }
			}
		}
	)

	K.loadSpriteAtlas(
		'ui.png', 
		{
			healthBar: {
				x: 16,
				y: 16,
				width: 60,
				height: 48,
				sliceY: 3
			}
		}
	)

	K.loadSpriteAtlas(
		'animations.png', 
		{
			cartridge: {
				x: 125,
				y: 145,
				width: 134,
				height: 16,
				sliceX: 8,
				anims: {
					default: { from: 0, to: 4, loop: true, speed: 7 }
				}
			}
		}
	);

	K.loadSprite(
		'tileset', 
		'tileset.png',
		{
	  		sliceX: 33,
	  		sliceY: 21,
		}
	)

	K.loadSprite(
		'background', 
		'background.png', 
		{
	  		sliceX: 13,
	  		sliceY: 25,
		}
	)

	K.loadSprite('room1', 'maps/room1.png')
	K.loadSprite('room2', 'maps/room2.png')

}

const loadFont = () => K.loadFont('glyphmesss', 'glyphmesss.ttf')

const loadSounds = () => {
	K.loadSound('notify', 'sounds/notify.mp3');
	K.loadSound('boom', 'sounds/boom.wav');
	K.loadSound('health', 'sounds/health.wav');
	K.loadSound('flamethrower', 'sounds/flamethrower.mp3');
}

export const loadEverything = () => {
	loadFont()
	loadSprites()
	loadSounds()
}
