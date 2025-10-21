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
				async deactivate () { return await deactivate(k, this) },
				setEvents () { return eventHandler(k, state, this) }
			}
		]
	)
}

const activate = async ( k: KAPLAYCtx, collider: Layer, bossBarrier: any ) => {
	await setOpacity(k, bossBarrier, 0.3, 0.5)
	await setCameraTransition(k, collider.properties![0].value)
}

const deactivate = async ( k: KAPLAYCtx, bossBarrier: any ) => {
	await setOpacity(k, bossBarrier, 0, 0.5)
	bossBarrier.unuse('body')
	bossBarrier.collisionIgnore = [ 'player' ]
	k.destroy(bossBarrier)
}

const eventHandler = ( k: KAPLAYCtx, state: State, bossBarrier: any ) => {
	bossBarrier.onCollide( 'player', async (player: GameObj) => await onContactWithPlayer(k, state, player) )
	bossBarrier.onCollideEnd( 'player', async () => await onBossFightStarting(k, state, bossBarrier) )

}

const setCameraTransition = async ( k: KAPLAYCtx, newPos: number ) => {
	const camPosY = k.getCamPos().y
	await k.tween(
		k.getCamPos().x,
		newPos,
		0.5,
		(val: number) => k.setCamPos(val, camPosY),
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
		1,
		(val: number) => player.pos.x = val,
		k.easings.linear
	)
	player.setControls()
}

const onBossFightStarting = async ( k: KAPLAYCtx, state: State, bossBarrier: GameObj ) => {
	if ( state.isBossFight || state.isBossDefeated ) return
	bossBarrier.use( k.body({isStatic: true}) )
	state.isBossFight = true
	await bossBarrier.activate()
}