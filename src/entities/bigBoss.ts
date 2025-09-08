import type { KAPLAYCtx, Vec2 } from "kaplay";

const STATES = [ 'idle', 'follow', 'open-fire', 'shut-fire', 'explode' ]

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
				fireRange: 40,
				fireDuration: 1,
				setBehavior () { return setBehavior(k, this) },
				setEvents () { return setEvents(k, this) },
			}
		]
	)
}

const setBehavior = ( k: KAPLAYCtx, bigBoss: any ) => {

}

const setEvents = ( k: KAPLAYCtx, bigBoss: any ) => {

}