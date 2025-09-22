import type { KAPLAYCtx, Vec2 } from "kaplay";
import { state, State } from "../state/sateManager";

export const makeHealthBar = ( k: KAPLAYCtx, pos: Vec2 ) => {
	const healthBar = k.make(
		[ 
			k.sprite('healthBar', {frame: 0}),
			k.pos(pos),
			k.scale(4),
			k.fixed(),
			'healthBar',
			{
				hpMapping: { 1: 2, 2: 1, 3: 0 },
				setEvents () { return setEvents(k, state, this) }
			}
		]
	)
	return healthBar
}

const setEvents = ( k: KAPLAYCtx, state: State, healthBar: any ) => {
	healthBar.on(
		'update',
		() => {
			if (state.playerHp === 0) return k.destroy(healthBar)
			healthBar.frame = healthBar.hpMapping[state.playerHp]
		}
	)
}