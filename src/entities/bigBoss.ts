import type { AudioPlay, GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { state, type State } from "../state/sateManager";
import { isPlayerInRange, kGet } from "../utils/helper";

const STATES = [ 'idle', 'follow', 'open-fire', 'fire', 'shut-fire', 'explode' ]

export const makeBigBoss = ( k: KAPLAYCtx, initialPos: Vec2 ) => {
	return k.make(
		[
			k.pos( initialPos ),
			k.sprite( 'burner', {anim: 'idle'} ),
			k.area( {shape: new k.Rect(k.vec2(0, 12), 12, 12)} ),
			k.anchor( 'center' ),
			k.opacity(1),
			k.health(15),
			k.state( 'idle', STATES ),
			'big-boss',
			{
				pursuitSpeed: 100,
				range: 40,
				fireDuration: 1,
				setBehavior () { return setBehavior(k, state, this) },
				setEvents () { return setEvents(k, this) },
			}
		]
	)
}

const setBehavior = ( k: KAPLAYCtx, state: State, boss: any ) => {
	boss.onStateUpdate( 'idle', () => state.isBossFight && boss.enterState('follow') )
	boss.onStateEnter( 'follow', () => boss.play('run') )
	boss.onStateUpdate( 'follow', () => stalker(k, boss) )
	boss.onStateEnter( 'fire', () => burnPlayer(k, state, boss) )
	boss.onStateEnd( 'fire', () => destroyFireHitbox(k) )
	boss.onStateEnter( 'shut-fire', () => boss.play('shutFire') )
}

const setEvents = ( k: KAPLAYCtx, boss: any ) => {

}

const stalker = ( k: KAPLAYCtx, boss: GameObj ) => {
	const player = kGet('player')
	boss.flipX = player.pos.x <= boss.pos.x
	boss.moveTo( k.vec2(player.pos.x, player.pos.y), boss.pursuitSpeed )
	if ( isPlayerInRange(player, boss) ) boss.enterState('open-fire')
}

const burnPlayer = ( k: KAPLAYCtx, state: State, boss: GameObj ) => {
	boss.play('openFire')
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