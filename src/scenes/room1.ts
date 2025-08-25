import type { KAPLAYCtx } from "kaplay"
import { setMapCollider, setBackgroundColor, setGravity, setCamera } from "../utils/background"
import { makePlayer } from "../entities/player"

export const room1 = ( k: KAPLAYCtx, roomData: any ) => {
	setBackgroundColor(k, '#a2aed5')

	setGravity(k, 1000)
	setCamera(k, 4, {x: 170, y: 100})
	setMapCollider(k, 'room1', roomData.layers)

	const player = makePlayer(k.vec2(100, 100))
}