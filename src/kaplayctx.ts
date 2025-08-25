import kaplay from 'kaplay'

export const scale = 2

export const K = kaplay( 
    {
        width: 640 * scale, 
        height: 360 * scale, 
        letterbox: true, 
        scale,
        global: false,
        touchToMouse: true,
        debugKey: 'd',
        debug: true
    } 
)
