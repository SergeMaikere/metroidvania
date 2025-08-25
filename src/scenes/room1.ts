import type { KAPLAYCtx } from "kaplay"
import { setMapCollider, setBackgroundColor, getMap, getColliders, setGravity, setCamera } from "../utils/background"

export const room1 = ( k: KAPLAYCtx, roomData: any ) => {
	setBackgroundColor(k, '#a2aed5')

	const [ map, colliders ] = [ getMap(k, 'room1'), getColliders(roomData.layers) ]
	setGravity(k, 1000)
	setCamera(k, 4, {x: 170, y: 100})
	setMapCollider(k, map, colliders)
}