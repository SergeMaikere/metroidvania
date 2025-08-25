import { K } from "../kaplayctx"

export const room1 = () => {
	console.log('This is Room 1')
	return K.add( [K.text('Hello World'), K.pos(K.center())] )
}