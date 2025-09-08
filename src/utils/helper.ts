import type { GameObj, KAPLAYCtx } from "kaplay"

export const curry = ( fn: Function ) => {
	const curried = ( ...args: any[] ) => {
		if ( args.length >= fn.length ) return fn.apply(this, args)
		return ( ...args2: any[] ) => curried.apply(this, args.concat(args2))
	}
	return curried
}

export const piper = ( ...fns: Function[] ) => (args: any) => fns.reduce( (g, f) => f(g), args )

export const asyncPiper = ( ...fns: Function[] ) => ( args: any ) => fns.reduce( (acc: Promise<any>, fn: Function) => acc.then((result: any) => fn(result)), Promise.resolve(args) )

export const fetchThis = async ( url: string ) => {
	const result = await fetch(url)
	if( !result.ok ) { throw new Error('Could not fetch from ' + url) }
	return await result.json() 
}

export const kGet = ( k: KAPLAYCtx ) => ( gameObj: string, recursive: boolean = true ) => k.get(gameObj, {recursive})[0]

export const isAnim = ( gameObj: GameObj, anim: string ) => gameObj.curAnim() === anim