import type { GameObj, KAPLAYCtx, Vec2 } from "kaplay"
import { curry, piper } from "./helper"
import { makePlayer, setPlayer } from "../entities/player"
import { makeBigBoss } from "../entities/bigBoss"
import { makeEnemyDrone } from "../entities/enemyDrone"
import { makeCartridge } from "../ui/cartridge"
import type { Layer } from "./background"
import { makeExitZone } from "../ui/exit"

export type PreviousSceneData = { exitName: string | null }

export const player = ( k: KAPLAYCtx, map: GameObj, exitName: string | null, positions: Layer[] ) => {
	piper(
		curry(getPlayerInitialPos)(k, exitName),
		curry(addEntityToMap)(k, map, makePlayer),
		curry(setPlayer)(k, exitName)
	)(positions)
	return positions
} 

export const boss = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(getEntityInitialPos)(k, 'boss'),
		curry(addEntityToMap)(k, map, makeBigBoss),
		setElement
	)(positions)
	return positions
} 

export const drones = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(filterPositionsByType)('drone'),
		curry(addElementsToMap)(k, map, makeEnemyDrone),
		setElements
	)(positions)
	return positions
} 

export const cartridges = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(filterPositionsByType)('cartridge'),
		curry(addElementsToMap)(k, map, makeCartridge),
		setElements
	)(positions)
	return positions
} 

export const setExitZones = ( k: KAPLAYCtx, map: GameObj, destination: string, exits: Layer[] ) => {
	piper(
		curry(addExitsToMap)(k, map, destination),
		setElements
	)(exits)
	return exits
}

const getPlayerInitialPos = ( k: KAPLAYCtx, exit: string | null, positions: Layer[] ) => {
	if ( !exit ) return getEntityInitialPos(k, 'player', positions)
	if ( exit === 'exit-1' ) return getEntityInitialPos(k, 'entrance-1', positions)
	if ( exit === 'exit-2' ) return getEntityInitialPos(k, 'entrance-2', positions)
}

export const getEntityInitialPos = ( k: KAPLAYCtx, name: string, positions: Layer[] ) => {
	const pos = positions.find( position => position.name === name )
	if ( !pos ) return
	return k.vec2(pos.x, pos.y + (name == 'boss' ? 16 : 0))
}

export const addEntityToMap = ( k: KAPLAYCtx, map: GameObj, entityMaker: Function, position: Vec2 ) => map.add( entityMaker(k, position) )

export const filterPositionsByType = ( name: string, positions: Layer[] ) => positions.filter( position => position.type === name )

export const filterPositionsByName = ( name: string, positions: Layer[] ) => positions.filter( position => position.name === name )

export const addElementsToMap = ( k: KAPLAYCtx, map: GameObj, entityMaker: Function, positions: Layer[] ) => {
	return positions.map( position => map.add(entityMaker(k, k.vec2(position.x, position.y))) ) 
}

export const setElement = ( element: GameObj ) => {
	if ( element.hasOwnProperty('setBehavior') ) element.setBehavior()
	if ( element.hasOwnProperty('setEvents') ) element.setEvents()
	return element
}

export const setElements = ( elements: GameObj[] ) => elements.map(setElement)

export const addExitsToMap = ( k: KAPLAYCtx, map: GameObj, destination: string, exits: Layer[] ) => {
	return exits.map( (exit: Layer) => map.add(makeExitZone(k, destination, exit)))
}