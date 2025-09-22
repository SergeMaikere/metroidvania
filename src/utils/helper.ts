import type { GameObj, KAPLAYCtx, Vec2 } from "kaplay"
import { K } from "../kaplayctx"
import type { Layer } from "./background"

export const curry = ( fn: Function ) => {
	const curried = ( ...args: any[] ) => {
		if ( args.length >= fn.length ) return fn.apply(this, args)
		return ( ...args2: any[] ) => curried.apply(this, args.concat(args2))
	}
	return curried
}

export const piper = ( ...fns: Function[] ) => (args: any) => fns.reduce( (g, f) => f(g), args )

export const asyncPiper = ( ...fns: Function[] ) => ( args: any ) => fns.reduce( (acc: Promise<any>, fn: Function) => acc.then((result: any) => fn(result)), Promise.resolve(args) )

export const fetchThis = async ( url: string ) => {
	const result = await fetch(url)
	if( !result.ok ) { throw new Error('Could not fetch from ' + url) }
	return await result.json() 
}

export const getEntityInitalPos = ( k: KAPLAYCtx, name: string, positions: Layer[] ) => {
	const pos = positions.find( position => position.name === name )
	if ( !pos ) return
	return k.vec2(pos.x, pos.y)
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

export const isPlayerInRange = ( player: GameObj, enemy: GameObj ) => enemy.pos.dist(player.pos) < enemy.range

export const kGet = ( gameObj: string, recursive: boolean = true ) => K.get(gameObj, {recursive})[0]

export const isAnim = ( gameObj: GameObj, anim: string ) => gameObj.curAnim() === anim

export const blink = async ( k: KAPLAYCtx, gameObj: GameObj, span: number = 0.1 ) => {
	await setOpacity(k, gameObj, 0, span)
	setOpacity(k, gameObj, 1, span)
}

export const setOpacity = async ( k: KAPLAYCtx, gameObj: GameObj, opacity: number, span: number ) => {
	await k.tween(
		gameObj.opacity,
		opacity,
		span,
		(val: number) => gameObj.opacity = val,
		k.easings.linear
	)
}

export const voyeur = (x: any, name: string = 'VOYEUR'): any => {
	console.log('\n' + name.toUpperCase())
	console.group()
	console.log(x)
	console.groupEnd()
	return x
}