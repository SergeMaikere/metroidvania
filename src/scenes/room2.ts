import type { KAPLAYCtx } from "kaplay"
import { getLayer, getMap, setBackgroundColor, setCamera, setGravity, setMapCollider } from "../utils/background"
import { setCameraControls, setCameraZones } from "../utils/cameras"
import { makeHealthBar } from "../ui/healthBar"
import { curry, kGet, piper } from "../utils/helper"
import { addEntityToMap, cartridges, player, setElement, setExitZones, type PreviousSceneData } from "../utils/layers"

export const room2 = ( k: KAPLAYCtx, roomData: any, prevScene: PreviousSceneData ) => {
	setBackgroundColor(k, '#a2aed5')
	setGravity(k, 2500)
	setCamera(k, 4, {x: 170, y: 100})

	const map = getMap(k, 'room2')
	const colliders = getLayer(roomData.layers, 'colliders')
	setMapCollider(k, map, colliders)

	const positions = getLayer(roomData.layers, 'positions')
	piper(
		curry(player)(k, map, prevScene.exitName), 
		curry(cartridges)(k, map)
	)(positions)

	const cameras = getLayer(roomData.layers, 'cameras')
	setCameraZones(k, map, cameras)
	setCameraControls(k, map, roomData, kGet('player'))

	const exits = getLayer(roomData.layers, 'exits')
	setExitZones(k, map, 'room1', exits)

	const healthBar = addEntityToMap(k, map, makeHealthBar, k.vec2(10, 10))
	setElement(healthBar)
	healthBar.trigger('update')
}