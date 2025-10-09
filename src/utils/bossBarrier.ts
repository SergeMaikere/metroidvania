import type { GameObj, KAPLAYCtx } from "kaplay";
import type { Layer } from "./background";
import { State, state } from "../state/sateManager";
import { setOpacity } from "./helper";

export const makeBossBarrier = ( k: KAPLAYCtx, collider: Layer ) => {
	return k.make(
		[
			k.pos( collider.x, collider.y ),
			k.area( {collisionIgnore: ['collider']} ),
			k.rect(collider.width, collider.height),
			k.opacity(0),
			k.color(k.Color.fromHex('#eacfba')),
			'boss-barrier',
			{
				async activate () { return await activate(k, collider, this) },
				async deactivate ( playerPosX: number ) { return await deactivate(k, playerPosX, this) },
				setEvents () { return eventHandler(k, state, this) }
			}
		]
	)
}

const activate = async ( k: KAPLAYCtx, collider: Layer, bossBarrier: any ) => {
	await setCameraTransition(k, collider.properties![0].value)
	await setOpacity(k, bossBarrier, 0.3, 1)
}

const deactivate = async ( k: KAPLAYCtx, playerPosX: number, bossBarrier: any ) => {
	await setCameraTransition(k, playerPosX)
	await setOpacity(k, bossBarrier, 0, 0.5)
	k.destroy(bossBarrier)

}

const eventHandler = ( k: KAPLAYCtx, state: State, bossBarrier: any ) => {
	bossBarrier.onCollide( 'player', (player: GameObj) => onContactWithPlayer(k, state, player) )
	bossBarrier.onCollideEnd( 'player', () => onBossFightStarting(k, state, bossBarrier) )

}

const setCameraTransition = async ( k: KAPLAYCtx, newPos: number ) => {
	await k.tween(
		k.getCamPos().x,
		newPos,
		3,
		(val: number) => k.setCamPos(val, k.getCamPos().y),
		k.easings.linear
	)
}

const onContactWithPlayer = async ( k: KAPLAYCtx, state: State, player: GameObj ) => {
	if ( state.isBossFight ) return
	return await onPlayerArrival(k, player)
}

const onPlayerArrival = async ( k: KAPLAYCtx, player: GameObj, ) => {
	player.disableControls()
	player.play('idle')
	await k.tween(
		player.pos.x,
		player.pos.x + 25,
		0.2,
		(val: number) => player.pos.x = val,
		k.easings.linear
	)
	player.setControls()
}

const onBossFightStarting = ( k: KAPLAYCtx, state: State, bossBarrier: GameObj ) => {
	if ( state.isBossFight || state.isBossDefeated ) return
	state.isBossFight = true
	bossBarrier.activate()
	bossBarrier.use( k.body({isStatic: true}) )
}