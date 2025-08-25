import { K } from "./kaplayctx";
import { intro } from "./scenes/intro";
import { room1 } from "./scenes/room1";
import { room2 } from "./scenes/room2";
import { loadEverything } from "./utils/assetsLoader";

const loadScenes = () => {
	K.scene('intro', intro)
	K.scene('room1', room1)
	K.scene('room2', room2)
	K.go('room1')
}

const run = () => {
	loadEverything()
	loadScenes()
}

run()
