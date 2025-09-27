import { type Vec2, type GameObj, type KAPLAYCtx } from "kaplay"
import { curry, piper } from "./helper"
import { makeBossBarrier } from "./bossBarrier"

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
			k.body({isStatic: true}),
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
	const bossBarrier =  map.add( makeBossBarrier(k, collider) )
	bossBarrier.setEvents()
}

export const getEntityInitalPos = ( k: KAPLAYCtx, name: string, positions: Layer[] ) => {
	const pos = positions.find( position => position.name === name )
	if ( !pos ) return
	return k.vec2(pos.x, pos.y + (name == 'boss' ? 30 : 0))
}

export const addEntityToMap = ( k: KAPLAYCtx, map: GameObj, entityMaker: Function, position: Vec2 ) => map.add( entityMaker(k, position) )

export const filterPositionsByType = ( name: string, positions: Layer[] ) => positions.filter( position => position.type === name )

export const filterPositionsByName = ( name: string, positions: Layer[] ) => positions.filter( position => position.name === name )

export const addEntitiesToMap = ( k: KAPLAYCtx, map: GameObj, entityMaker: Function, positions: Layer[] ) => positions.map( position => map.add(entityMaker(k, k.vec2(position.x, position.y))) ) 

export const setEntity = ( entity: GameObj ) => {
	if ( entity.hasOwnProperty('setBehavior') ) entity.setBehavior()
	if ( entity.hasOwnProperty('setEvents') ) entity.setEvents()
	return entity
}

export const setEntities = ( entities: GameObj[] ) => entities.map(setEntity)