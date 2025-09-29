import type { GameObj, KAPLAYCtx } from "kaplay";
import type { Layer } from "../utils/background";
import { getTag, sceneTransition } from "../utils/helper";

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
				setEvents () { return setEvents(k, destination, this) }
			}
		]
	)
}

const setEvents = ( k: KAPLAYCtx, destination: string, exitZone: GameObj ) => {
	exitZone.onCollide(
		'player',
		async () => {
			await sceneTransition(k)
			exitZone.name === 'final-exit'  ? k.go('final-exit') : k.go(destination, {exitName: getTag(exitZone)})
		}
	)
}
