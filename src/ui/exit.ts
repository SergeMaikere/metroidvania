import type { KAPLAYCtx } from "kaplay";
import type { Layer } from "../utils/background";

export const makeExitZone = ( k: KAPLAYCtx, destination: string, exit: Layer ) => {
	return k.make(
		[
			k.pos( exit.x, exit.y ),
			k.area(
				{
					shape: new k.Rect(k.vec2(0), exit.width, exit.height),
					collisionIgnore: ['collider']
				}
			),
			k.body( {isStatic: true} ),
			exit.name,
			{
				setEvent () { return setEvents(k, destination, this) }
			}
		]
	)
}

const setEvents = ( k: KAPLAYCtx, destination: string, exitZone: any ) => {
	exitZone.onCollide(
		'player',
		async () => {
			const background = k.add(
				[
					k.pos( - k.width(), 0 ),
					k.rect( k.width(), k.height() ),
					k.color('#20214a')
				]
			)

			await k.tween(
				background.pos.x,
				0,
				0.3,
				( val: number ) => background.pos.x = val,
				k.easings.linear
			)

			exitZone.name === 'final-exit'  ? k.go('final-exit') : k.go(destination, {exinName: exitZone.name})
		}
	)
}