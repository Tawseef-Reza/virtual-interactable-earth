var RAD2DEG = 180 / Math.PI

/**
 * Convert [x,y,z] cartesian coordinates to polar [lat,lon]
 * @param {Vector3} coord
 * @return {Array<Number>}
 */
function CartesianToPolar( coord, radius ) {

    var lon = Math.atan2( coord.x, -coord.z ) * RAD2DEG
    var length = Math.sqrt( coord.x * coord.x + coord.z * coord.z )
    var lat = Math.atan2( coord.y, length ) * RAD2DEG
  
    return [ lon, lat ]
  
}

export default CartesianToPolar;