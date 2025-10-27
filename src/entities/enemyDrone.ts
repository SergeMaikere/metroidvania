import type { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import type { Point } from "../utils/background";
import { asyncPiper, curry, isPlayerInRange, kGet, piper } from "../utils/helper";

const STATES = ['patroling-right', 'patroling-left', 'alert', 'attack', 'retreat']

type Patroling = 'patroling-left' | 'patroling-right'

export const makeEnemyDrone = ( k: KAPLAYCtx, initialPos: Vec2 ) => {

	return k.make(
		[
			k.pos( initialPos ),
			k.sprite( 'drone', {anim: 'flying'} ),
			k.area( {shape: new k.Rect(k.vec2(0), 12, 12)} ),
			k.body( {gravityScale: 0} ),
			k.anchor( 'center' ),
			k.offscreen( {distance: 400} ),
			k.health( 1 ),
			k.state( 'patroling-right', STATES ),
			'drone',
			{
				speed: 100,
				pursuitSpeed: 130,
				range: 100,
				setBehavior () { return stateBehaviorHandler(k, this) },
				setEvents () { return eventsHandler(k, initialPos, this) }
			}
		]
	)

}

const stateBehaviorHandler = ( k: KAPLAYCtx, drone: any ) => {
	const player = kGet('player')

	return asyncPiper(

		curry(setPatrolingBehavior)(k, 'patroling-right'),
		curry(setPatrolingBehavior)(k, 'patroling-left'),
		curry(setAlertBehavior)(player, 'patroling-right'),
		curry(setAlertBehavior)(player, 'patroling-left'),
		curry(setSwitchToAttack)(k, player),
		curry(setAttackBehavior)(k, player)

	)(drone)
}

const eventsHandler = ( k: KAPLAYCtx, initialPos: Point, drone: any ) => {
	const player = kGet('player')

	return piper(
		curry(onCollidingWithPlayer)(player),
		curry(onExplosionEndDestroyDrone)(k),
		curry(onExplode)(k),
		onPlayerHit,
		onFinalHit,
		curry(onLeavingScreen)(initialPos)
	)(drone)
}

// State related functions

const setPatrolingBehavior = async ( k: KAPLAYCtx, state: Patroling, drone: GameObj ) => {
	drone.onStateEnter( state, async () => await setPatrolingDirection(k, state, drone) )
	return drone
}

const setAlertBehavior = ( player: GameObj, state: Patroling, drone: GameObj ) => {
	drone.onStateUpdate( state, () => setStateToAlert(player, state, drone) )
	return drone
}

const setSwitchToAttack = ( k: KAPLAYCtx, player: GameObj, drone: GameObj ) => {
	drone.onStateEnter( 'alert', () => setStateToAttack(k, player, drone) )
	return drone
}

const setAttackBehavior = ( k: KAPLAYCtx, player: GameObj, drone: GameObj ) => {
	drone.onStateUpdate( 'attack', () => attackManager(k, player, drone) )
	return drone
}

const setPatrolingDirection = async ( k: KAPLAYCtx, state: Patroling, drone: GameObj ) => {
	await k.wait(3)
	drone.enterState( ( state === 'patroling-right' ) ? 'patroling-left' : 'patroling-right' )
}

const setStateToAlert = ( player:GameObj, state: Patroling, drone: GameObj ) => {
	if ( isPlayerInRange(player, drone)  ) drone.enterState('alert')

	drone.flipX = state === 'patroling-left'
	drone.move( state === 'patroling-left' ? - drone.speed : drone.speed, 0 )
}

const setStateToAttack = async ( k: KAPLAYCtx, player: GameObj, drone: GameObj ) => {
	await k.wait(1)
	drone.enterState( isPlayerInRange(player, drone) ? 'attack' : 'patroling-right' )
}

const attackManager = ( k: KAPLAYCtx, player: GameObj, drone: GameObj ) => {
	if ( !isPlayerInRange(player, drone) ) return drone.enterState('alert')

	drone.flipX = drone.pos.x >= player.pos.x
	drone.moveTo( k.vec2(player.pos.x, player.pos.y + 12), drone.pursuitSpeed )
}


//Events related Functions

const onCollidingWithPlayer = ( player: GameObj, drone: GameObj ) => {
	drone.onCollide( 'player', () => setHealthDecrease(player, drone) )
	return drone
}

const setHealthDecrease = ( player: GameObj, drone: GameObj ) => {
	if ( player.isAttacking ) return
	drone.hurt(1)
	player.hurt(1)
}

const onExplosionEndDestroyDrone = ( k: KAPLAYCtx, drone: GameObj) => {
	drone.onAnimEnd( (anim: string) => anim === 'explode' && k.destroy(drone) )
	return drone
}

const onExplode = ( k: KAPLAYCtx, drone: GameObj ) => {
	drone.on( 'explode', () => handleDroneExplosion(k, drone) )
	return drone
}

const handleDroneExplosion = ( k: KAPLAYCtx, drone: GameObj ) => {
	k.play('boom', {volume: 0.3})
	drone.collisionIgnore = [ 'player' ]
	drone.unuse('body')
	drone.play('explode')
}

const onPlayerHit = ( drone: GameObj ) => {
	drone.onCollide( 'sword-hitbox', () => drone.hurt(1) )
	return drone
}

const onFinalHit = ( drone: GameObj ) => {
	drone.on( 'hurt', () => drone.hp() === 0 && drone.trigger('explode') )
	return drone
}

const onLeavingScreen = ( initialPos: Vec2, drone: GameObj ) => {
	drone.onExitScreen( () => drone.pos = initialPos )
	return drone
}