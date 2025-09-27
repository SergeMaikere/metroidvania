import type { KAPLAYCtx } from "kaplay"
import { setMapCollider, setBackgroundColor, setGravity, setCamera, getLayer, getMap } from "../utils/background"
import { setCameraControls, setCameraZones } from "../utils/cameras"
import { curry, kGet, piper } from "../utils/helper"
import { makeHealthBar } from "../ui/healthBar"
import { addEntityToMap, boss, cartridges, drones, player, setElement, setExitZones } from "../utils/layers"

export const room1 = ( k: KAPLAYCtx, roomData: any, previousSceneData: any = {exitName: null} ) => {

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

	const exits = getLayer(roomData.layers, 'exits')
	setExitZones(k, map, 'room2', exits)

	const healthBar = addEntityToMap(k, map, makeHealthBar, k.vec2(10, 10))
	setElement(healthBar)
	healthBar.trigger('update')
}


