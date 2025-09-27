import type { GameObj, KAPLAYCtx } from "kaplay"
import { getEntityInitalPos, type Layer, addEntityToMap, setEntity, filterPositionsByType, addEntitiesToMap, setEntities } from "./background"
import { curry, piper } from "./helper"
import { makePlayer, setPlayer } from "../entities/player"
import { makeBigBoss } from "../entities/bigBoss"
import { makeEnemyDrone } from "../entities/enemyDrone"
import { makeCartridge } from "../ui/cartridge"

export const player = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(getEntityInitalPos)(k, 'player'),
		curry(addEntityToMap)(k, map, makePlayer),
		setPlayer
	)(positions)
	return positions
} 

export const boss = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(getEntityInitalPos)(k, 'boss'),
		curry(addEntityToMap)(k, map, makeBigBoss),
		setEntity
	)(positions)
	return positions
} 

export const drones = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(filterPositionsByType)('drone'),
		curry(addEntitiesToMap)(k, map, makeEnemyDrone),
		setEntities
	)(positions)
	return positions
} 

export const cartridges = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(filterPositionsByType)('cartridge'),
		curry(addEntitiesToMap)(k, map, makeCartridge),
		setEntities
	)(positions)
	return positions
} 