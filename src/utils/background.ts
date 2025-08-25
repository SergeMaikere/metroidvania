import { type GameObj, type KAPLAYCtx } from "kaplay"

type Point = { x: number, y: number }

interface Layer {
	name: string,
	id: number,
	type: string,
	visibility: boolean
	data: number[],
	width: number,
	height: number,
	opacity: number,
	x: number,
	y: number,
	polygon?: Point[]
}

export const setBackgroundColor = (k: KAPLAYCtx, hexColor: string) => {
	return k.add(
		[
			k.rect(k.width(), k.height()),
			k.color(k.Color.fromHex(hexColor)),
			k.fixed()
		]
	)
}

export const setGravity = ( k: KAPLAYCtx, gravity: number ) => k.setGravity(gravity)

export const setCamera = ( k: KAPLAYCtx, scale: number, pos: Point ) => {
	k.camScale(scale)
	k.camPos(pos.x, pos.y)
}

export const getMap = ( k: KAPLAYCtx, room: string ) => k.add( [k.sprite(room), k.pos(0, 0)] )

export const getColliders = ( layers: Layer[] ) => layers
	.filter( (layer: any) => layer.name === 'colliders' )
	.reduce( (acc: any[], curr: any) => [...acc, curr], [] )

export const setMapCollider = ( k: KAPLAYCtx, map: GameObj, colliders: Layer[] ) => {
	for ( const collider of colliders ) {
		if ( collider.polygon ) setColliderWithPolygons(k, map, collider)
		if ( !collider.polygon ) setBasicCollider(k, map, collider)
		if ( collider.name === 'boss-barrier' ) setBossBarrierCollider(k, map, collider)
	}
}

const setCoordinates = ( k: KAPLAYCtx, polygons: Point[] ) => polygons.map( (point: Point) => k.vec2(point.x, point.y) )

const setColliderWithPolygons = ( k: KAPLAYCtx, map: GameObj, collider: Layer ) => {
	const coordinates = setCoordinates(k, collider.polygon!)
			
	return map.add(
		[
			k.pos( collider.x, collider.y ),
			k.area( 
				{
					shape: new k.Polygon(coordinates), 
					collisionIgnore: ['collider']
				} 
			),
			collider.type,
			'collider'
		]
	)
}

const setBasicCollider = ( k: KAPLAYCtx, map: GameObj, collider: Layer ) => {
	return map.add(
		[
			k.pos( collider.x, collider.y ),
			k.area( 
				{
					shape: new k.Rect(k.vec2(0), collider.width, collider.height),
					collisionIgnore: ['collider']
				} 
			),
			k.body( {isStatic: true} ),
			collider.type,
			'collider'
		]
	)
}

const setBossBarrierCollider = ( k: KAPLAYCtx, map: GameObj, collider: Layer ) => {
	// return map.add(
	// 	[
	// 		k.pos( collider.x, collider.y ),
	// 		k.area( {shape: new k.Rect(k.vec2(0), collider.width, collider.height)} ),
	// 		k.body( {isStatic: true} )
	// 	]
	// )
}