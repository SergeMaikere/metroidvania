import type { KAPLAYCtx } from "kaplay";
import { setBackgroundColor } from "../utils/background";
import { makeNotificationBox } from "../ui/notificationBox";

export const intro = (k: KAPLAYCtx) => {
	setBackgroundColor(k, '#eacfba')
	const instructions = 'Escape the Factory!\nUse arrows keys to move\nup to jump, space to attack.'
	k.add( makeNotificationBox(k, instructions, {width: 500, height: 200}) )
	k.onKeyPress('enter', () => k.go('room1'))
}