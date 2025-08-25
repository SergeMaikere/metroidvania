import { type GameObj, type KAPLAYCtx } from "kaplay"
import { curry, piper } from "./helper"

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
	k.setCamScale(scale)
	k.setCamPos(pos.x, pos.y)
}

export const setMapCollider = ( k: KAPLAYCtx, room: string, layers: Layer[] ) => {
	let [ map, colliders ] = [ getMap(k, room), getColliders(layers) ]

	for ( const collider of colliders ) {
		piper(
			curry(setColliderWithPolygons)(k, map),
			curry(setBasicCollider)(k, map),
			curry(setBossBarrierCollider)(k, map)
		)(collider)
	}
}

const getMap = ( k: KAPLAYCtx, room: string ) => k.add( [k.sprite(room), k.pos(0, 0)] )

const getColliders = ( layers: Layer[] ) => layers
	.filter( (layer: any) => layer.name === 'colliders' )
	.reduce( (acc: any[], curr: any) => [...acc, curr], [] )

const setCoordinates = ( k: KAPLAYCtx, polygons: Point[] ) => polygons.map( (point: Point) => k.vec2(point.x, point.y) )

const setColliderWithPolygons = ( k: KAPLAYCtx, map: GameObj, collider: Layer ) => {
	if ( !collider.polygon ) return collider

	const coordinates = setCoordinates(k, collider.polygon!)			
	map.add(
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
	return collider
}

const setBasicCollider = ( k: KAPLAYCtx, map: GameObj, collider: Layer ) => {
	map.add(
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
	return collider
}

const setBossBarrierCollider = ( k: KAPLAYCtx, map: GameObj, collider: Layer ) => {
	if ( collider.name !== 'boss-barrier' ) return collider

	// return map.add(
	// 	[
	// 		k.pos( collider.x, collider.y ),
	// 		k.area( {shape: new k.Rect(k.vec2(0), collider.width, collider.height)} ),
	// 		k.body( {isStatic: true} )
	// 	]
	// )
	return collider
}