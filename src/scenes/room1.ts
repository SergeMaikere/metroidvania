import type { KAPLAYCtx } from "kaplay"
import { setMapCollider, setBackgroundColor, setGravity, setCamera, getLayer, getMap } from "../utils/background"
import { makePlayer, setPlayer, setPlayerPosition } from "../entities/player"
import { setCameraControls, setCameraZones } from "../utils/cameras"

export const room1 = ( k: KAPLAYCtx, roomData: any ) => {
	setBackgroundColor(k, '#a2aed5')
	setGravity(k, 1000)
	setCamera(k, 4, {x: 170, y: 100})

	const map = getMap(k, 'room1')
	const colliders = getLayer(roomData.layers, 'colliders')
	setMapCollider(k, map, colliders)

	const player = map.add( makePlayer(k) )
	const positions = getLayer(roomData.layers, 'positions')
	setPlayerPosition(positions, player)

	const cameras = getLayer(roomData.layers, 'cameras')
	setCameraZones(k, map, cameras)
	setCameraControls(k, map, roomData, player)

	setPlayer(player)
}
