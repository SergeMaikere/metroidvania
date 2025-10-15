import type { KAPLAYCtx } from "kaplay";
import { setBackgroundColor } from "../utils/background";
import { makeNotificationBox } from "../ui/notificationBox";

export const gameover = ( k: KAPLAYCtx ) => {
	setBackgroundColor(k, '#20214a')
	const loser = 'YOU COULD NOT ESCAPE THE FACTORY!\n\nThe means of production shall forever\n belong to the bourgeosie!\n\nPress Enter to try again.'
	k.add( makeNotificationBox(k, loser) )
	k.onKeyPress( 'enter', () => k.go('intro') )
}