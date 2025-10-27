import type { AudioPlay, GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { state, type State } from "../state/sateManager";
import { blink, curry, isPlayerInRange, kGet } from "../utils/helper";
import { makeNotificationBox } from "../ui/notificationBox";

const STATES = [ 'idle', 'follow', 'open-fire', 'fire', 'shut-fire', 'explode' ]

export const makeBigBoss = ( k: KAPLAYCtx, initialPos: Vec2 ) => {
	return k.make(
		[
			k.pos( initialPos ),
			k.sprite( 'burner', {anim: 'idle'} ),
			k.area( {shape: new k.Rect(k.vec2(0, 12), 12, 12)} ),
			k.anchor( 'center' ),
			k.opacity(1),
			k.health(9),
			k.state( 'idle', STATES ),
			'big-boss',
			{
				pursuitSpeed: 100,
				range: 40,
				fireDuration: 1,
				setBehavior () { return setBehavior(k, state, this) },
				setEvents () { return setEvents(k, state, this) },
			}
		]
	)
}

const setBehavior = ( k: KAPLAYCtx, state: State, boss: any ) => {

	boss.onStateUpdate( 'idle', () => state.isBossFight && boss.enterState('follow') )
	boss.onStateEnter( 'follow', () => boss.play('run') )
	boss.onStateUpdate( 'follow', () => stalker(k, boss) )
	boss.onStateEnter( 'open-fire', () => boss.play('openFire') )
	boss.onStateEnter( 'fire', () => burnPlayer(k, state, boss) )
	boss.onStateEnd( 'fire', () => destroyFireHitbox(k) )
	boss.onStateEnter( 'shut-fire', () => boss.play('shutFire') )
}

const setEvents = ( k: KAPLAYCtx, state: State, boss: any ) => {
	boss.onCollide( 'sword-hitbox', () => onHitByPlayer(k, boss) )
	boss.onAnimEnd( curry(stateFlowCloser)(k, boss) )
	boss.on( 'explode', async () =>  await onExplode(k, state, boss) )
	boss.on( 'hurt', () => onHurt(k, boss) )
}

const stalker = ( k: KAPLAYCtx, boss: GameObj ) => {
	const player = kGet('player')
	boss.flipX = player.pos.x <= boss.pos.x
	boss.moveTo( k.vec2(player.pos.x, boss.pos.y), boss.pursuitSpeed )
	if ( isPlayerInRange(player, boss) ) boss.enterState('open-fire')
}

const burnPlayer = ( k: KAPLAYCtx, state: State, boss: GameObj ) => {
	boss.play('fire')
	const flameThrowerSfx = k.play('flamethrower')
	const fireHitbox = setFireHitbox(k, boss)
	onBurningPlayer(fireHitbox, state)
	onEndingTheAttack(k, flameThrowerSfx, boss)
}

const setFireHitbox = ( k: KAPLAYCtx, boss: GameObj ) => {
	return boss.add(
		[
			k.area( {shape: new k.Rect(k.vec2(0), 70, 10)} ),
			k.pos( boss.flipX ? -70 : 0, 5 ),
			'fire-hitbox'
		]
	)
}

const onBurningPlayer = ( fireHitbox: GameObj, state: State ) => {
	fireHitbox.onCollide(
		'player',
		(player: GameObj) => {
			player.hurt(1)
			state.isBossFight = player.hp() !== 0
		}
	)
}

const onEndingTheAttack = ( k: KAPLAYCtx, flameThrowerSfx: AudioPlay, boss: GameObj ) => {
	k.wait(
		boss.fireDuration,
		() => {
			flameThrowerSfx.stop()
			boss.enterState('shut-fire')
		}
	)
}

const destroyFireHitbox = ( k: KAPLAYCtx ) => {
	const fireHitbox = kGet('fire-hitbox')
	if ( fireHitbox ) k.destroy(fireHitbox)
}

const onHitByPlayer = ( k: KAPLAYCtx, boss: GameObj ) => {
	k.play('boom')
	boss.hurt(1)
}

const stateFlowCloser = ( k: KAPLAYCtx, boss: GameObj, anim: string ) => {
	if ( anim === 'openFire' ) boss.enterState('fire')
	if ( anim === 'shutFire' ) boss.enterState('follow')
	if ( anim === 'explode' ) k.destroy(boss)
}

const onExplode = async ( k: KAPLAYCtx, state: State, boss: GameObj ) => {
	const player = updatePlayer()	
	
	updateBigBoss(k, boss)
	await displayWinNotification(k)
	await kGet('boss-barrier').deactivate(player)
	updateState(state)

	player.setControls()
}

const onHurt = ( k: KAPLAYCtx, boss: GameObj ) => {
	blink(k, boss)
	boss.hp() === 0 && boss.trigger('explode')
}

const updatePlayer = () => {
	const player = kGet('player')
	player.disableControls()
	player.enableDoubleJump()
	return player
}

const updateBigBoss = ( k: KAPLAYCtx, boss: GameObj ) => {
	boss.enterState('explode')
	boss.collisionIgnore = [ 'player' ]
	boss.unuse('body')
	k.play('boom', {volume: 0.3})
	boss.play('explode')
}

const displayWinNotification = async ( k: KAPLAYCtx ) => {
	k.play('notify')
	const content = 'You unlocked a new ability!\nYou can now double jump.'
	const notification = k.add( makeNotificationBox(k, content, {width: 500, height: 180}) )
	await k.wait( 3, () => notification.close() )
}

const updateState = (state: State ) => {
	state.isBossDefeated = true
	state.isBossFight = false
	state.isDoubleJump = true
}

