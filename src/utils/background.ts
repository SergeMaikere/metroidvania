import { type Polygon, type GameObj, type KAPLAYCtx, type Rect } from "kaplay"
import { curry, piper } from "./helper"
import { makeBossBarrier } from "./bossBarrier"
import { state } from "../state/sateManager"

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


export const getMap = ( k: KAPLAYCtx, room: string ): GameObj => k.add( [k.sprite(room), k.pos(0, 0), 'map'] )

export const getLayer = ( layers: any[], name: string ): Layer[] => layers.find( layer => layer.name === name ).objects

export const setMapCollider = ( k: KAPLAYCtx, map: GameObj, colliders: Layer[] ) => {
	colliders.forEach(
		(collider) => {
			piper(
				curry(setBossBarrierCollider)(k, map),
				curry(setColliderWithPolygons)(k, map),
				curry(setBasicCollider)(k, map)
			)(collider)
		}
	)
}

const setColliderWithPolygons = ( k: KAPLAYCtx, map: GameObj, collider: Layer ) => {
	if ( !collider.polygon ) return collider

	const coordinates = collider.polygon.map( (point: Point) => k.vec2(point.x, point.y) )			
	map.add( makeCollider(k, collider, new k.Polygon(coordinates)) )
	return collider
}

const setBasicCollider = ( k: KAPLAYCtx, map: GameObj, collider: Layer ) => {
	if ( collider.name === 'boss-barrier' || collider.polygon ) return collider

	const shape = new k.Rect(k.vec2(0), collider.width, collider.height)
	map.add( makeCollider(k, collider, shape) )
	return collider
}

const setBossBarrierCollider = ( k: KAPLAYCtx, map: GameObj, collider: Layer ) => {
	if ( collider.name !== 'boss-barrier' || state.isBossDefeated ) return collider

	const bossBarrier =  map.add( makeBossBarrier(k, collider) )
	bossBarrier.setEvents()
	return collider
}

const makeCollider = ( k: KAPLAYCtx, layer: Layer, shape: Polygon | Rect ) => {
	const collider = k.make(
		[
			k.pos( layer.x, layer.y ),
			k.area( 
				{
					shape, 
					collisionIgnore: ['collider']
				} 
			),
			k.body({isStatic: true}),
		]
	)
	return addColliderTag(collider, layer)
}

const addColliderTag = ( collider: GameObj, layer: Layer) => {
	if ( layer.type ) collider.tag(layer.type)
	collider.tag('collider')
	return collider
}