
export class State {

	static instance: State

	readonly maxPlayerHp: number = 3
	_playerHp: number = this.maxPlayerHp

	isDoubleJump: boolean = false
	isBossDefeated: boolean = false
	isBossFight: boolean = false

	constructor () {
		if ( State.instance ) return State.instance
		State.instance = this

	}

	set playerHp ( value: number ) {
		if ( value > this.maxPlayerHp || value < 0 ) return
		this._playerHp = value
	}

	get playerHp () { return this._playerHp }
}

export const state = new State()