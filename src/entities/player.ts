import type { KAPLAYCtx } from "kaplay";
import { state } from "../state/sateManager";

export const makePlayer = ( k: KAPLAYCtx ) => {
	return k.make(
		[
			k.pos(),
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
				isAttacking: false
			}
		]
	)
}