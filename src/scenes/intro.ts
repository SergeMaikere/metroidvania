import type { KAPLAYCtx } from "kaplay";
import { setBackgroundColor } from "../utils/background";

export const intro = (k: KAPLAYCtx) => {
	setBackgroundColor(k, '#000000')
	k.add( 
		[
			k.text('Nice Intro', {font: 'glyphmesss', size: 96}), 
			k.pos(k.center()), 
			k.anchor('center')
		] 
	)
	k.onKeyPress('enter', () => k.go('room1'))
}