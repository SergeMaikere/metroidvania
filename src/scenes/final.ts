import type { KAPLAYCtx } from "kaplay"
import { setBackgroundColor } from "../utils/background"
import { makeNotificationBox } from "../ui/notificationBox"

export const final = (k: KAPLAYCtx) => {
	setBackgroundColor(k, '#20214a')
	const byebye = 'You escaped the Factory!\nThank you for playing!'
	k.add( makeNotificationBox(k, byebye) )
	k.go('intro')
}