import type { Collision, GameObj, KAPLAYCtx, KEventController, Vec2 } from "kaplay";
import { State, state } from "../state/sateManager";
import type { Point } from "../utils/background";
import { blink, curry, isPlayerOnScreen, kGet, sceneTransition } from "../utils/helper";
import type { PreviousSceneData } from "../utils/layers";

type Direction = 'left' | 'right'

export const makePlayer = ( k: KAPLAYCtx, initialPos: Vec2 ) => {
	return k.make(
		[
			k.pos(initialPos),
			k.sprite('player'),
			k.anchor('center'),
			k.area({shape: new k.Rect(k.vec2(0, 18), 12, 12)}),
			k.opacity(),
			k.body(),
			// k.doubleJump(state.isDoubleJump ? 2 : 1),
			k.doubleJump(2),
			k.health(state.playerHp),
			'player',
			{
				speed: 150,
				isAttacking: false,
				controlHandlers: [],
				setPosition ( pos: Point ) { return positionHandler(pos, this) },
				setControls () { return setControls(k, this) },
				disableControls () { return disableControls(this) },
				setEvents () { return setEvents(k, state, this) },
				enablePassthrough () { return passthrough(this) },
				outOfBounds (bounds: number, destination: string, previsousSceneData: any = {exitName: null}) { 
					return outOfBounds(k, bounds, destination, previsousSceneData, this) 
				},
				enableDoubleJump () { (this as unknown as GameObj).use(k.doubleJump(2)) }
			}
		]
	)
}

export const setPlayer = ( k: KAPLAYCtx, exit: string | null, player: GameObj ) => {
	player.setControls()
	player.setEvents()
	player.enablePassthrough()
	player.outOfBounds(1200, 'room1')
	exit && k.setCamPos(player.pos)
	return player
}

const positionHandler = ( p: Point, player: any ) => {
	player.pos.x = p.x
	player.pos.y = p.y
}

const setControls = ( k: KAPLAYCtx, player: any  ) => {
	const events = [ onKeyPress, onKeyDown, onKeyRelease ]
	player.controlHandlers = events.map( event => event(k, player) )
}

const disableControls = ( player: any ) => player.controlHandlers.forEach( (handler: KEventController) => handler.cancel() )

const setEvents = ( k: KAPLAYCtx, state: State, player: any ) => {
	player.onFall( () => player.play('fall') )
	player.onFallOff( () => player.play('fall') )
	player.onGround( () => player.play('idle') )
	player.onHeadbutt( () => player.play('fall') )
	player.on( 'heal', () => updateHealth(state, player) )
	player.on( 'hurt', () => onHurt(k, state, player) )
	player.onAnimEnd( (anim: string) => anim === 'explode' && k.destroy(player) )
}


const onHurt = async ( k: KAPLAYCtx, state: State, player: GameObj ) => {
	await blink(k, player)
	updateHealth(state, player )
	if ( player.hp() === 0 ) playerDies(k, state, player)
}

const updateHealth = ( state: State, player: GameObj ) => {
	state.playerHp = player.hp()
	kGet('healthBar').trigger('update')
}

const playerDies = ( k: KAPLAYCtx, state: State, player: GameObj ) => {
	k.play('boom', {volume: 0.5})
	player.play('explode')

	state.playerHp = state.maxPlayerHp
	state.isDoubleJump = false
	state.isBossDefeated = false
	
	k.go('game-over')
}

const passthrough = ( player: any ) => {
	player.onBeforePhysicsResolve(
		(collision: Collision) => {
			if ( collision.target.is('passthrough') && player.isJumping() ) {
				collision.preventResolution()
			}
		}
	)
}

const onKeyPress = ( k: KAPLAYCtx, player: GameObj ) => {
	return k.onKeyPress(
		(key) => {
			if ( key === 'up' ) doJump(player)
			if ( key === 'space' ) doAttack(k, player)
		}
	)
}

const onKeyDown = ( k: KAPLAYCtx, player: GameObj ) => {
	return k.onKeyDown(
		(key) => {
			if ( key === 'left' ) go(player, 'left')
			if ( key === 'right' ) go(player, 'right')
		}
	)
}

const onKeyRelease = ( k: KAPLAYCtx, player: GameObj ) => k.onKeyRelease(curry(randomKeyReleaseHandler)(player))

const isIdleAnim = ( player: GameObj ) => player.curAnim() === 'idle'
const isJumpAnim = ( player: GameObj ) => player.curAnim() === 'jump'
const isFallAnim = ( player: GameObj ) => player.curAnim() === 'fall'
const isAttackAnim = ( player: GameObj ) => player.curAnim() === 'attack'
const isRunAnim = ( player: GameObj ) => player.curAnim() === 'run'

const doJump = ( player: GameObj ) => player.doubleJump(450)

const doAttack = ( k: KAPLAYCtx, player: GameObj ) => {
	if ( isAttackAnim(player) || !player.isGrounded() ) return
	player.isAttacking = true
	addSwordHitbox(k, player)
	player.play('attack')
	player.onAnimEnd( curry(returnToPeace)(k, player) )
}

const addSwordHitbox = ( k: KAPLAYCtx, player: GameObj ) => {
	return player.add(
		[
			k.pos( player.flipX ? -25 : 0, 10 ),
			k.area( {shape: new k.Rect(k.vec2(0), 25, 10)} ),
			'sword-hitbox'
		]
	)
}

const returnToPeace = ( k: KAPLAYCtx, player: GameObj, anim: string ) => {
	if ( anim !== 'attack' ) return
	destroySwordHitbox(k)
	player.isAttacking = false
	player.play('idle')
}

const destroySwordHitbox = ( k: KAPLAYCtx ) => {
	const swordHitbox = kGet('sword-hitbox')
	return swordHitbox && k.destroy(swordHitbox)
}

const go = ( player: GameObj, direction: Direction ) => {
	if ( player.isAttacking ) return
	if ( !isRunAnim(player) && player.isGrounded() ) player.play('run')
	player.flipX = direction === 'left'
	player.move( setPlayerSpeed(player, direction), 0 )
}

const setPlayerSpeed = ( player: GameObj, direction: Direction ) => direction === 'left' ? - player.speed : player.speed

const randomKeyReleaseHandler = ( player: GameObj, _key: string ) => {
	if ( isIdleAnim(player) || isJumpAnim(player) || isFallAnim(player) || isAttackAnim(player) ) return
	player.play('idle')
}

const outOfBounds = ( k: KAPLAYCtx, bounds: number, destination: string, prevScene: PreviousSceneData, player: any ) => {
	k.onUpdate( async () => player.pos.y > bounds && isPlayerOnScreen(k, player) && await backToTheBeginning(k, destination, prevScene) )
}

const backToTheBeginning = async ( k: KAPLAYCtx, destination: string, prevScene: PreviousSceneData ) => {
	await sceneTransition(k)
	k.go(destination, prevScene)
}