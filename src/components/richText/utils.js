export const cssParser = ( ElementStyle ) => {
    const styleObj = {}
    Object.keys(ElementStyle).map( key => {
        if ( isNaN(key) && ElementStyle[key] !== '' && key === 'color' ) {
            styleObj[key] = ElementStyle[key]
        }
    })
    return styleObj;
}