import { type GameObj, type KAPLAYCtx } from "kaplay"
import { curry, piper } from "./helper"

export type Point = { x: number, y: number }

export interface Layer {
	name: string,
	id: number,
	type: string,
	visibility: boolean
	data?: number[],
	width: number,
	height: number,
	opacity?: number,
	rotation?: number,
	properties?: any[],
	objects?: any[],
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

export const setMapCollider = ( k: KAPLAYCtx, map: GameObj, colliders: Layer[] ) => {
	colliders.forEach(
		(collider) => {
			piper(
				curry(setColliderWithPolygons)(k, map),
				curry(setBasicCollider)(k, map),
				curry(setBossBarrierCollider)(k, map)
			)(collider)
		}
	)
}

export const getMap = ( k: KAPLAYCtx, room: string ): GameObj => k.add( [k.sprite(room), k.pos(0, 0)] )

export const getLayer = ( layers: any[], name: string ): Layer[] => layers.find( layer => layer.name === name ).objects

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