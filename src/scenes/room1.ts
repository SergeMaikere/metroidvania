import type { GameObj, KAPLAYCtx } from "kaplay"
import { setMapCollider, setBackgroundColor, setGravity, setCamera, getLayer, getMap, type Layer } from "../utils/background"
import { makePlayer, setPlayer } from "../entities/player"
import { setCameraControls, setCameraZones } from "../utils/cameras"
import { makeEnemyDrone } from "../entities/enemyDrone"
import { addEntitiesToMap, addEntityToMap, filterPositionsByType, getEntityInitalPos, setEntities, setEntity } from "../utils/background"
import { makeBigBoss } from "../entities/bigBoss"
import { makeCartridge } from "../ui/cartridge"
import { curry, kGet, piper } from "../utils/helper"
import { makeHealthBar } from "../ui/healthBar"

export const room1 = ( k: KAPLAYCtx, roomData: any ) => {

	setBackgroundColor(k, '#a2aed5')
	setGravity(k, 2500)
	setCamera(k, 4, {x: 170, y: 100})

	const map = getMap(k, 'room1')
	const colliders = getLayer(roomData.layers, 'colliders')
	setMapCollider(k, map, colliders)

	const positions = getLayer(roomData.layers, 'positions')
	piper(
		curry(player)(k, map), 
		curry(boss)(k, map), 
		curry(drones)(k, map), 
		curry(cartridges)(k, map)
	)(positions)

	const cameras = getLayer(roomData.layers, 'cameras')
	setCameraZones(k, map, cameras)
	setCameraControls(k, map, roomData, kGet('player'))

	const healthBar = addEntityToMap(k, map, makeHealthBar, k.vec2(10, 10))
	setEntity(healthBar)
}



// Utils
const player = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(getEntityInitalPos)(k, 'player'),
		curry(addEntityToMap)(k, map, makePlayer),
		setPlayer
	)(positions)
	return positions
} 

const boss = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(getEntityInitalPos)(k, 'boss'),
		curry(addEntityToMap)(k, map, makeBigBoss),
		setEntity
	)(positions)
	return positions
} 

const drones = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(filterPositionsByType)('drone'),
		curry(addEntitiesToMap)(k, map, makeEnemyDrone),
		setEntities
	)(positions)
	return positions
} 

const cartridges = ( k: KAPLAYCtx, map: GameObj, positions: Layer[] ) => {
	piper(
		curry(filterPositionsByType)('cartridge'),
		curry(addEntitiesToMap)(k, map, makeCartridge),
		setEntities
	)(positions)
	return positions
} 