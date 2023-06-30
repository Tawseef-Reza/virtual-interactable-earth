import { Vector3 } from "three"

var DEG2RAD = Math.PI / 180

/**
 * Convert [lat,lon] polar coordinates to [x,y,z] cartesian coordinates
 * @param {Number} lon
 * @param {Number} lat
 * @param {Number} radius
 * @return {Vector3}
 */
function PolarToCartesian( lon, lat, radius ) {

  var phi = ( 90 - lat ) * DEG2RAD
  var theta = ( lon + 180 ) * DEG2RAD

  return new Vector3(
    -(radius * Math.sin(phi) * Math.sin(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta)
  )
  // return {
  //   x: -(radius * Math.sin(phi) * Math.sin(theta)),
  //   y: radius * Math.cos(phi),
  //   z: radius * Math.sin(phi) * Math.cos(theta),
  // }

}

export default PolarToCartesian;