import type { GameObj, KAPLAYCtx, Vec2 } from "kaplay";
import { state, State } from "../state/sateManager";

export const makeCartridge = ( k: KAPLAYCtx, pos: Vec2 ) => {
	const myState = state
	return k.make(
		[
			k.pos( pos ),
			k.sprite( 'cartridge', {anim: 'default'} ),
			k.anchor( 'center' ),
			k.area(),
			'cartridge',
			{
				setEvents () { return setEvents(k, myState, this) }
			}
		]
	)
}

const setEvents = ( k: KAPLAYCtx, state: State, cartridge: any ) => {
	cartridge.onCollide(
		'player',
		(player: GameObj) => {
			k.play('health', {volume: 0.5})
			if ( player.hp() < state.maxPlayerHp ) player.heal(1)
			k.destroy(cartridge)
		}
	)
}

