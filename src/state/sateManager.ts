
class State {

	static instance: State

	private _playerHp: number
	private static _maxPlayerHp: number = 3

	private _isDoubleJump: boolean
	private _isBossDefeated: boolean
	private _isBossFight: boolean

	constructor () {
		if ( State.instance ) return State.instance
		State.instance = this

		this._playerHp = 3
		this._isDoubleJump = false
		this._isBossDefeated = false
		this._isBossFight = false
	
	}

	set playerHp ( value: number ) {
		if ( value > State._maxPlayerHp || value < 0 ) return
		this._playerHp = value
	}

	set isDoubleJump ( value: boolean ) { this._isDoubleJump = value }
	set isBossDefeated ( value: boolean ) { this._isBossDefeated = value }
	set isBossFight ( value: boolean ) { this._isBossFight = value }
}

export const state = new State()