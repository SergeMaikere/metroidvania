import type { KAPLAYCtx } from "kaplay";
import { setBackgroundColor } from "../utils/background";
import { makeNotificationBox } from "../ui/notificationBox";

export const intro = (k: KAPLAYCtx) => {
	setBackgroundColor(k, '#20214a')
	const instructions = 'Escape the Factory!\nUse arrows keys to move, w to jump, x to attack.'
	k.add( makeNotificationBox(k, instructions) )
	k.onKeyPress('enter', () => k.go('room1'))
}