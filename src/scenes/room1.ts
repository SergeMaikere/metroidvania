import type { GameObj, KAPLAYCtx } from "kaplay"
import { setMapCollider, setBackgroundColor, setGravity, setCamera, type Layer } from "../utils/background"
import { makePlayer } from "../entities/player"

export const room1 = ( k: KAPLAYCtx, roomData: any ) => {
	setBackgroundColor(k, '#a2aed5')

	setGravity(k, 1000)
	setCamera(k, 4, {x: 170, y: 100})
	const [ map, positions ] = setMapCollider(k, 'room1', roomData.layers)
	const player = (map as GameObj).add( makePlayer(k) )
	setPlayer(positions as Layer[], player)
}

const setPlayer = ( positions: Layer[], player: GameObj ) => {
	setPlayerPosition(positions, player)
	player.setControls()
	player.setEvents()
	player.enablePasstrough()
}

const setPlayerPosition = ( positions: Layer[], player: GameObj ) => {
	positions.filter( position => position.name === 'player' )
	.forEach( position => player.setPosition({x: position.x, y: position.y}) )
}