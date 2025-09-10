import type { Collision, GameObj, KAPLAYCtx, KEventController, Vec2 } from "kaplay";
import { State, state } from "../state/sateManager";
import type { Layer, Point } from "../utils/background";
import { blink, curry, kGet } from "../utils/helper";

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
			k.doubleJump(state.isDoubleJump ? 2 : 1),
			k.health(state.playerHp),
			'player',
			{
				speed: 150,
				isAttacking: false,
				controlHandlers: [],
				setPosition ( pos: Point ) { return positionHandler(pos, this) },
				setControls () { return setControls(k, this) },
				disableControls () { return disableControls(this) },
				setEvents () { return eventHandler(k, state, this) },
				enablePassthrough () { return passthrough(this) },
			}
		]
	)
}

export const setPlayer = ( player: GameObj ) => {
	player.setControls()
	player.setEvents()
	player.enablePassthrough()
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

const eventHandler = ( k: KAPLAYCtx, state: State, player: any ) => {
	player.onFall( () => player.play('fall') )
	player.onFallOff( () => player.play('fall') )
	player.onGround( () => player.play('idle') )
	player.onHeadbutt( () => player.play('fall') )
	player.on( 'heal', () => onHeal(state, player) )
	player.on( 'hurt', () => onHurt(k, state, player) )
	player.onAnimEnd( (anim: string) => anim === 'explode' && k.go('intro') )
}

const onHeal = ( state: State, player: GameObj ) => {
	state.playerHp = player.hp()
}

const onHurt = async ( k: KAPLAYCtx, state: State, player: GameObj ) => {
	await blink(k, player)
	player.hp() > 0 ? state.playerHp = player.hp() : playerDies(k, state, player)
}

const playerDies = ( k: KAPLAYCtx, state: State, player: GameObj ) => {
	k.play('boom')
	state.playerHp = state.maxPlayerHp
	player.play('explode')
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
			if ( key === 's' ) doJump(player)
			if ( key === 'x' ) doAttack(k, player)
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

const doJump = ( player: GameObj ) => {
	if ( isJumpAnim(player) ) player.play('jump')
	player.doubleJump()
}

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
