import type { KAPLAYCtx } from "kaplay"
import { setMapCollider, setBackgroundColor, setGravity, setCamera, getLayer, getMap } from "../utils/background"
import { makePlayer, setPlayer } from "../entities/player"
import { setCameraControls, setCameraZones } from "../utils/cameras"
import { makeEnemyDrone } from "../entities/enemyDrone"
import { addEntitiesToMap, addEntityToMap, curry, filterPositionsByType, getEntityInitalPos, piper, setEntities, setEntity, voyeur } from "../utils/helper"
import { makeBigBoss } from "../entities/bigBoss"
import { makeCartridge } from "../entities/cartridge"

export const room1 = ( k: KAPLAYCtx, roomData: any ) => {

	setBackgroundColor(k, '#a2aed5')
	setGravity(k, 2500)
	setCamera(k, 4, {x: 170, y: 100})

	const map = getMap(k, 'room1')
	const colliders = getLayer(roomData.layers, 'colliders')
	setMapCollider(k, map, colliders)

	const positions = getLayer(roomData.layers, 'positions')
	
	const player = piper(
		curry(getEntityInitalPos)(k, 'player'),
		curry(addEntityToMap)(k, map, makePlayer),
		setPlayer
	)(positions)

	const boss = piper(
		curry(getEntityInitalPos)(k, 'boss'),
		curry(addEntityToMap)(k, map, makeBigBoss),
		setEntity
	)(positions)
	
	const drones = piper(
		curry(filterPositionsByType)('drone'),
		curry(addEntitiesToMap)(k, map, makeEnemyDrone),
		setEntities
	)(positions)

	const cartridges = piper(
		curry(filterPositionsByType)('cartridge'),
		curry(addEntitiesToMap)(k, map, makeCartridge),
		setEntities
	)(positions)

	const cameras = getLayer(roomData.layers, 'cameras')
	setCameraZones(k, map, cameras)
	setCameraControls(k, map, roomData, player)

}
