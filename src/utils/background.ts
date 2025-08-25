import type { KAPLAYCtx } from "kaplay"

export const setBackgroundColor = (k: KAPLAYCtx, hexColor: string) => {
	return k.add(
		[
			k.rect(k.width(), k.height()),
			k.color(k.Color.fromHex(hexColor)),
			k.fixed()
		]
	)
}