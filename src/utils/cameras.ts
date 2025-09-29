import type { GameObj, KAPLAYCtx } from "kaplay";
import type { Layer } from "./background";
import { state } from "../state/sateManager";

export const setCameraZones = ( k: KAPLAYCtx, map: GameObj, cameras: Layer[] ) => {
	for ( const camera of cameras ) {
		const camerazone = addCameraZone(k, map, camera)
		const newPositon = getCameraProp(camera, 'camPosY')
		onCollide(k, camerazone, newPositon)
	}
}

export const setCameraControls = ( k: KAPLAYCtx, map: GameObj, roomData: any, player: GameObj ) => {
	k.onUpdate(
		() => {
			if ( state.isBossFight ) return
			if ( isPlayerTooFarLeft(map, player) ) return setCamToMaxLeft(k, map)
			if ( isPlayerTooFarRight(map, player, roomData) ) return setCamToMaxRight(k, map, roomData)
			followPlayer(k, player)
		}
	)
}

const addCameraZone = ( k: KAPLAYCtx, map: GameObj, camera: Layer ) => {
	return map.add(
		[
			k.area( 
				{
					shape: new k.Rect(k.vec2(0), camera.width, camera.height),
					collisionIgnore: ['collider']
				} 
			),
			k.pos(camera.x, camera.y)
		]
	)
}

const getCameraProp = ( camera: Layer, prop: string ) => camera.properties?.find( property => property.name === prop ).value

const onCollide = ( k: KAPLAYCtx, camerazone: GameObj, newPositon: number ) => {
	camerazone.onCollide(
		'player',
		() => {
			if ( k.getCamPos().x === newPositon ) return
			k.tween(
				k.getCamPos().y,
				newPositon,
				0.3,
				(val) => k.setCamPos(k.getCamPos().x, val),
				k.easings.linear
			)
		}
	)
}

const isPlayerTooFarLeft = ( map: GameObj, player: GameObj ) => map.pos.x + 160 > player.pos.x 
const isPlayerTooFarRight = ( map: GameObj, player: GameObj, roomData: any ) => player.pos.x > map.pos.x + roomData.width * roomData.tilewidth - 160

const setCamToMaxLeft = ( k: KAPLAYCtx, map: GameObj ) => k.setCamPos( k.vec2(map.pos.x + 160, k.getCamPos().y) )
const setCamToMaxRight = ( k: KAPLAYCtx, map: GameObj, roomData: any ) => {
	k.setCamPos( k.vec2(map.pos.x + roomData.width * roomData.tilewidth - 160, k.getCamPos().y) )
}

const followPlayer = ( k: KAPLAYCtx, player: GameObj ) => k.setCamPos( k.vec2(player.pos.x, k.getCamPos().y) )