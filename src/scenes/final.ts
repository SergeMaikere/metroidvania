import type { KAPLAYCtx } from "kaplay"
import { setBackgroundColor } from "../utils/background"
import { makeNotificationBox } from "../ui/notificationBox"

export const final = (k: KAPLAYCtx) => {
	setBackgroundColor(k, '#eacfba')
	const byebye = 'You escaped the Factory!\nThank you for playing!\n\nWanna start again? Press enter!'
	k.add( makeNotificationBox(k, byebye, {width: 600, height: 200}) )
	k.wait(3)
	k.onKeyPress( 'enter', () => k.go('intro') )
}