import { PerspectiveCamera } from "@react-three/drei"
import { useRef } from "react"
import { animated } from "@react-spring/three";

function CustomCamera(props) {
	
	const meshRef = useRef();

	return (
			<animated.group position={props.position}>
				<PerspectiveCamera
				ref={meshRef}
				makeDefault
				fov={props.fov}
				zoom={props.zoom}
				/>
			</animated.group>
			
		)
	
		// return (
		// 		<PerspectiveCamera
		// 		ref={meshRef}
		// 		makeDefault
		// 		position={props.position}
		// 		fov={props.fov}
		// 		zoom={props.zoom}
		// 		/>
		// )
    
}

export default CustomCamera