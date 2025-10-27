import type { KAPLAYCtx } from "kaplay";

export const makeNotificationBox = ( k: KAPLAYCtx, content: string, rect: {width: number, height: number} ) => {

	const container = k.make(
		[
			k.rect( rect.width, rect.height ),
			k.color( k.Color.fromHex('#20214a') ),
			k.fixed(),
			k.pos( k.center() ),
			k.anchor( 'center' ),
			k.area(),
			{
				close () { k.destroy(this as any) }
			}
		]
	)

	container.add(
		[
			k.text( content, {font: 'glyphmesss', size: 32} ),
			k.color( k.Color.fromHex('#eacfba') ),
			k.area(),
			k.anchor( 'center' )
		]
	)

	return container
}