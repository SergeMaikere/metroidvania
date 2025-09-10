import type { KAPLAYCtx } from "kaplay"
import { setMapCollider, setBackgroundColor, setGravity, setCamera, getLayer, getMap } from "../utils/background"
import { makePlayer, setPlayer } from "../entities/player"
import { setCameraControls, setCameraZones } from "../utils/cameras"
import { setDrones } from "../entities/enemyDrone"
import { addEntityToMap, curry, getEntityInitalPos, piper } from "../utils/helper"
import { makeBigBoss, setBoss } from "../entities/bigBoss"

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
		setBoss
	)(positions)
	
	setDrones(k, map, positions)

	const cameras = getLayer(roomData.layers, 'cameras')
	setCameraZones(k, map, cameras)
	setCameraControls(k, map, roomData, player)

}
