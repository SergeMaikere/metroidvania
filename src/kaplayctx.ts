import kaplay from 'kaplay'

export const scale = 2

export const K = kaplay( 
    {
        width: 640 * 2, 
        height: 360 * 2, 
        letterbox: true, 
        scale,
        background: [0, 0, 0],
        global: false,
        touchToMouse: true,
        debugKey: 'd',
        debug: true
    } 
)
