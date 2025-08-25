
export const curry = ( fn: Function ) => {
	const curry = ( ...args: any[] ) => {
		if ( args.length >= fn.length ) return fn.apply(this, args)
		return ( ...args2: any[] ) => curry.apply(this, args.concat(args2))
	}
	return curry
}

export const piper = ( ...fns: Function[] ) => (args: any) => fns.reduce( (g, f) => f(g), args )

export const fetchThis = async ( url: string ) => {
	const result = await fetch(url)
	if( !result.ok ) { throw new Error('Could not fetch from ' + url) }
	return await result.json() 
}