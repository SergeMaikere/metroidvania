
export class State {

	static instance: State

	private _maxPlayerHp: number = 3
	private _playerHp: number = this._maxPlayerHp

	private _isDoubleJump: boolean = false
	private _isBossDefeated: boolean = false
	private _isBossFight: boolean = false

	constructor () {
		if ( State.instance ) return State.instance
		State.instance = this

	}

	set playerHp ( value: number ) {
		if ( value > this._maxPlayerHp || value < 0 ) return
		this._playerHp = value
	}

	set isDoubleJump ( value: boolean ) { this._isDoubleJump = value }
	set isBossDefeated ( value: boolean ) { this._isBossDefeated = value }
	set isBossFight ( value: boolean ) { this._isBossFight = value }

	get playerHp () { return this._playerHp }
	get isDoubleJump () { return this._isDoubleJump }
	get isBossDefeated () { return this._isBossDefeated }
	get isBossFight () { return this._isBossFight }
}

export const state = new State()