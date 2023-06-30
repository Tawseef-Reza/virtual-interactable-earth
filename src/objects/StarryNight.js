import { useMemo, useRef } from 'react';
import { extend, useFrame, useLoader } from '@react-three/fiber';
import { Points, Point, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import glsl from 'babel-plugin-glsl/macro'
import { rgbToHex } from '@mui/material';
const ROT_SPEED = 0.1;
const size = 6
const COLOR_INTERVAL = 255 / size

const spacing = 0.01
// const PortalMaterial = shaderMaterial(
//     uniforms,
//     glsl`
//     ${vertex}`,
//     glsl`
//     ${fragment}`
// )

// extend({ PortalMaterial })

const StarryNight = () => {
    

    return (
		<group>
			<Space />
			<MainStars />
			
		</group>
		
        
        );
    };



const Space = (props) => {
	return (
		<mesh position = {[500, 0, 0]}>
			<sphereBufferGeometry attach="geometry" args={[2000, 32, 32]} />
			<meshStandardMaterial side={THREE.DoubleSide} attach="material" color={'black'} />        
		</mesh>
	)
}

const MainStars = (props) => {
	const ref = useRef()
	useFrame((state, delta) => {
        ref.current.rotation.y += (delta * ROT_SPEED);
    })
	return (
		<group  position={[500, 0, 0]} ref = {ref}>
			<points  >
				<sphereBufferGeometry  args={[1500, 8, 4]} />
				<pointsMaterial side={THREE.DoubleSide} color={0xffffff} args={[
					{
						size: 10,
						sizeAttenuation: true
					}
				]} attach={'material'}/>
			</points>
		</group>
	)
}

// const Trail = (props) => {
// 	const ref = useRef()
// 	useFrame((state, delta) => {
//         ref.current.rotation.y += (delta * ROT_SPEED);
		
//     })
// 	return (
// 		<group  position={[500, 0, 0]} ref = {ref}>
// 			{(() => {
// 				let pointsArr = []
				
// 				for (let i = 0; i < props.size; i++) {
					
// 						let val = 255 - COLOR_INTERVAL * (i + 1)
// 						const hexString = rgbToHex(`rgb( ${val}, ${val}, ${val})`)
// 						let hexDeci = parseInt(hexString.replace(/^#/, ''), 16);
// 						let currentColor = new THREE.Color(hexDeci)
// 						console.log(hexString);
// 						pointsArr.push(
// 							<points key={`${i}`} >
// 								<sphereBufferGeometry  args={[1500, 8, 4, spacing * - (i + 1)]} />
// 								<pointsMaterial opacity={1} side={THREE.DoubleSide} color={0xffffff} args={[
// 									{
// 										size: 20,
// 										sizeAttenuation: true,
	
// 									}
// 								]} attach={'material'}/>
// 							</points>
// 						)
// 				}
// 				return pointsArr
// 			})()}
			
			
// 		</group>
// 	)
// }
//<meshStandardMaterial side={THREE.BackSide} attach="material" color={'black'} /> 
export default StarryNight;

/*
<mesh ref={ref} position = {[500, 0, 200]} rotation={[0,0,0]}>
	<sphereBufferGeometry attach="geometry" args={[100, 16, 16]} />
	<meshStandardMaterial side={THREE.DoubleSide} attach="material" map={night} />        
</mesh>
*/