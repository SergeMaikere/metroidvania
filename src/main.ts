import { K } from "./kaplayctx";
import { intro } from "./scenes/intro";
import { room1 } from "./scenes/room1";
import { room2 } from "./scenes/room2";
import { loadEverything } from "./utils/assetsLoader";
import { fetchThis } from "./utils/helper";
import type { PreviousSceneData } from "./utils/layers";

const loadScenes = async () => {
	const room1Data = await fetchThis('maps/room1.json')
	const room2Data = await fetchThis('maps/room2.json')

	K.scene('intro', () => intro(K))
	K.scene('room1', ( prevScene: PreviousSceneData ) => room1(K, room1Data, prevScene))
	K.scene('room2', ( prevScene: PreviousSceneData ) => room2(K, room2Data, prevScene))
	K.go('intro')
}

const run = async () => {
	loadEverything()
	await loadScenes()
}

run()
