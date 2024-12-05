export const TooltipPositionCalculations  = Object.freeze({
    top: {
        anchor:{
            left: async(positionInfo) => ({
                x: Math.round( positionInfo.x + 10 ),
                y: Math.round(positionInfo.top) 
            }),
            right: async(positionInfo)=> ({
                x: Math.round(positionInfo.x + positionInfo.width - 20) ,
                y: Math.round(positionInfo.top) 
            }),
            middle: async(positionInfo)=>({
                x: Math.round(positionInfo.x + positionInfo.width / 2) ,
                y: Math.round(positionInfo.top) 
            })
        }
    },
    bottom: {
        anchor: {
            left: async (positionInfo) => ({
                x: Math.round(positionInfo.x + 10) ,
                y: Math.round(positionInfo.bottom) 
            }),
            right: async (positionInfo) => ({
                x: Math.round(positionInfo.x + positionInfo.width - 20) ,
                y: Math.round(positionInfo.bottom) 
            }),
            middle: async (positionInfo) => ({
                x: Math.round(positionInfo.x + positionInfo.width / 2),
                y: Math.round(positionInfo.bottom) 
            })
        }
    },
    left: {
        anchor:{
            top: async(positionInfo)=> ({
                x: Math.round(positionInfo.x - 10),
                y: Math.round(positionInfo.top)
            }),
            bottom: async(positionInfo)=>({
                x: Math.round(positionInfo.x),
                y: Math.round(positionInfo.bottom - 10)
            }),
            middle: async(positionInfo)=>({
                x: Math.round(positionInfo.x - 10),
                y: Math.round(positionInfo.top + positionInfo.height / 2)
            }),
        }
    },
    right: {
        anchor:{
            top: async(positionInfo)=>({
                x: Math.round(positionInfo.right),
                y: Math.round(positionInfo.top)
            }),
            bottom: async(positionInfo)=>({
                x: Math.round(positionInfo.right),
                y: Math.round(positionInfo.bottom - 10)
            }),
            middle: async(positionInfo)=>({
                x: Math.round(positionInfo.right),
                y: Math.round(positionInfo.top + positionInfo.height / 2)
            })
        },

    },

})

async function calculatePosition(){
    //create a generic function that can handle all the calculations
}